package br.com.recycle.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
//
import br.com.recycle.backend.dto.SaidaRequestDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.model.Estoque;
import br.com.recycle.backend.model.Material;
import br.com.recycle.backend.model.Saida;
import br.com.recycle.backend.repository.EstoqueRepository;
import br.com.recycle.backend.repository.MaterialRepository;
import br.com.recycle.backend.repository.SaidaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SaidaService {

    private final SaidaRepository saidaRepository;
    private final EstoqueRepository estoqueRepository;
    private final MaterialRepository materialRepository;

    public SaidaService(SaidaRepository saidaRepository, EstoqueRepository estoqueRepository,
            MaterialRepository materialRepository) {
        this.saidaRepository = saidaRepository;
        this.estoqueRepository = estoqueRepository;
        this.materialRepository = materialRepository;
    }

    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @Transactional
    public SaidaResponseDTO registrarSaida(SaidaRequestDTO dto, Long usuarioId) {
        Material material = materialRepository.findByIdAndUsuarioId(dto.getMaterialId(), usuarioId)
                .orElseThrow(() -> new RuntimeException("Material não encontrado ou não pertence ao usuário"));

        Estoque estoque = estoqueRepository.findByMaterialIdAndMaterial_UsuarioId(dto.getMaterialId(), usuarioId)
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
        for (SaidaRequestDTO dto : dtos) {
            if (dto.getMaterialId() == null || dto.getQuantidade() == null || dto.getQuantidade() <= 0) {
                throw new RuntimeException("Dados inválidos para registro de saída");
            }

            Material material = materialRepository.findByIdAndUsuarioId(dto.getMaterialId(), usuarioId)
                    .orElseThrow(() -> new RuntimeException("Material não encontrado: " + dto.getMaterialId()));
        }

        List<SaidaResponseDTO> resultados = new ArrayList<>();
        for (SaidaRequestDTO dto : dtos) {
            SaidaResponseDTO resultado = registrarSaida(dto, usuarioId);
            resultados.add(resultado);
        }

        return resultados;
    }

    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @Transactional(readOnly = true)
    public List<SaidaResponseDTO> listarSaidas(Long usuarioId, LocalDateTime dataInicio, LocalDateTime dataFim) { 
        
        List<Saida> saidas;
        if (dataInicio != null && dataFim != null) {
            saidas = saidaRepository.findByUsuarioIdAndDataBetween(usuarioId, dataInicio, dataFim);
        } else {
            saidas = saidaRepository.findByUsuarioId(usuarioId);
        }

        return saidas.stream()
                .map(SaidaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
//
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @Transactional(readOnly = true)
    public Page<SaidaResponseDTO> listarSaidasPaginado(Long usuarioId, LocalDateTime inicio, LocalDateTime fim, Pageable pageable) {
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