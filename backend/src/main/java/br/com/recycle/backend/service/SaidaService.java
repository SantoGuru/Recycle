package br.com.recycle.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
//
import br.com.recycle.backend.dto.SaidaRequestDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.model.Empresa;
import br.com.recycle.backend.model.Estoque;
import br.com.recycle.backend.model.Material;
import br.com.recycle.backend.model.Saida;
import br.com.recycle.backend.repository.EstoqueRepository;
import br.com.recycle.backend.repository.MaterialRepository;
import br.com.recycle.backend.repository.SaidaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SaidaService {

    private final SaidaRepository saidaRepository;
    private final EstoqueRepository estoqueRepository;
    private final MaterialRepository materialRepository;
    private final FuncionarioService funcionarioService;

    public SaidaService(SaidaRepository saidaRepository, EstoqueRepository estoqueRepository,
            MaterialRepository materialRepository, FuncionarioService funcionarioService) {
        this.saidaRepository = saidaRepository;
        this.estoqueRepository = estoqueRepository;
        this.materialRepository = materialRepository;
        this.funcionarioService = funcionarioService;
    }

    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @Transactional
    public SaidaResponseDTO registrarSaida(SaidaRequestDTO dto, Long usuarioId) {
        Empresa empresaUsuario = funcionarioService.getEmpresaUsuario(usuarioId);
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Material não encontrado: " + dto.getMaterialId()));

        Empresa empresaDoMaterial = material.getUsuario().getEmpresa();
        if (!empresaDoMaterial.getId().equals(empresaUsuario.getId())) {
            throw new RuntimeException("Usuário não tem acesso aos materiais desta empresa");
        }

        Estoque estoque = estoqueRepository.findByMaterialId(material.getId())
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado"));

        if (estoque.getQuantidade() < dto.getQuantidade()) {
            throw new RuntimeException("Quantidade insuficiente no estoque. Disponível: " + estoque.getQuantidade());
        }

        Float novaQuantidade = estoque.getQuantidade() - dto.getQuantidade();
        Float novoValorTotal = novaQuantidade * estoque.getPrecoMedio();

        estoque.setQuantidade(novaQuantidade);
        estoque.setValorTotal(novoValorTotal);
        estoqueRepository.save(estoque);

        Saida saida = new Saida();
        saida.setQuantidade(dto.getQuantidade());
        saida.setUsuarioId(usuarioId);
        saida.setMaterial(material);
        saida.setMaterialId(material.getId());
        saida.setEstoque(estoque);

        return SaidaResponseDTO.fromEntity(saidaRepository.save(saida));
    }

    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @Transactional
    public List<SaidaResponseDTO> registrarSaidas(List<SaidaRequestDTO> dtos, Long usuarioId) {
        Empresa empresaUsuario = funcionarioService.getEmpresaUsuario(usuarioId);

        for (SaidaRequestDTO dto : dtos) {
            if (dto.getMaterialId() == null || dto.getQuantidade() == null || dto.getQuantidade() <= 0) {
                throw new RuntimeException("Dados inválidos para registro de saída");
            }
        }

        Set<Long> materialIds = dtos.stream()
                .map(SaidaRequestDTO::getMaterialId)
                .collect(Collectors.toSet());

        List<Material> materiais = materialRepository.findAllById(materialIds);

        Map<Long, Material> materialMap = materiais.stream()
                .collect(Collectors.toMap(Material::getId, Function.identity()));

        for (Long id : materialIds) {
            Material mat = materialMap.get(id);

            if (mat == null) {
                throw new RuntimeException("Material não encontrado: " + id);
            }

            if (!mat.getUsuario().getEmpresa().getId().equals(empresaUsuario.getId())) {
                throw new RuntimeException(
                        "Material ID " + id + " pertence a outra empresa.");
            }
        }

        List<Estoque> estoques = estoqueRepository.findByMaterialIdIn(materialIds);

        List<Saida> novasSaidas = new ArrayList<>();
        Map<Long, Estoque> estoqueMap = estoques.stream()
                .collect(Collectors.toMap(e -> e.getMaterial().getId(), Function.identity()));

        for (SaidaRequestDTO dto : dtos) {
            Material material = materialMap.get(dto.getMaterialId());
            Estoque estoque = estoqueMap.get(dto.getMaterialId());

            if (estoque == null) {
                throw new RuntimeException("Estoque não encontrado para material ID: " + dto.getMaterialId());
            }

            if (estoque.getQuantidade() < dto.getQuantidade()) {
                throw new RuntimeException(
                        "Quantidade insuficiente para o material ID " + dto.getMaterialId() +
                                ". Disponível: " + estoque.getQuantidade());
            }

            Float novaQuantidade = estoque.getQuantidade() - dto.getQuantidade();
            estoque.setQuantidade(novaQuantidade);
            estoque.setValorTotal(novaQuantidade * estoque.getPrecoMedio());

            Saida saida = new Saida();
            saida.setQuantidade(dto.getQuantidade());
            saida.setUsuarioId(usuarioId);
            saida.setMaterial(material);
            saida.setMaterialId(material.getId());
            saida.setEstoque(estoque);

            novasSaidas.add(saida);
        }

        estoqueRepository.saveAll(estoqueMap.values());
        saidaRepository.saveAll(novasSaidas);

        return novasSaidas.stream()
                .map(SaidaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @Transactional(readOnly = true)
    public List<SaidaResponseDTO> listarSaidas(Long usuarioId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        Empresa empresa = funcionarioService.getEmpresaUsuario(usuarioId);

        List<Saida> saidas;
        if (dataInicio != null && dataFim != null) {
            saidas = saidaRepository.findByUsuario_EmpresaIdAndDataBetween(empresa.getId(),dataInicio,dataFim);
        } else {
            saidas = saidaRepository.findByUsuario_EmpresaId(empresa.getId());
        }

        return saidas.stream()
                .map(SaidaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    //
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @Transactional(readOnly = true)
    public Page<SaidaResponseDTO> listarSaidasPaginado(Long usuarioId, LocalDateTime inicio, LocalDateTime fim,
            Pageable pageable) {
        if (inicio != null && fim != null) {
            return saidaRepository
                    .findByUsuarioIdAndDataBetween(usuarioId, inicio, fim, pageable)
                    .map(SaidaResponseDTO::fromEntity);
        }
        return saidaRepository
                .findByUsuarioId(usuarioId, pageable)
                .map(SaidaResponseDTO::fromEntity);
    }

}