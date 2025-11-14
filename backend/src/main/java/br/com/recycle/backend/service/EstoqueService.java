package br.com.recycle.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
//
import java.util.List;
import java.util.stream.Collectors;

import br.com.recycle.backend.dto.DashboardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.model.Empresa;
import br.com.recycle.backend.model.Estoque;
import br.com.recycle.backend.repository.EstoqueRepository;

@Service
public class EstoqueService {

    private final EstoqueRepository estoqueRepository;
    private final FuncionarioService funcionarioService;

    @Autowired
    public EstoqueService(EstoqueRepository estoqueRepository, FuncionarioService funcionarioService) {
        this.estoqueRepository = estoqueRepository;
        this.funcionarioService = funcionarioService;
    }

    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    public EstoqueResponseDTO buscarPorId(Long id, Long usuarioId) {

        Estoque estoque = estoqueRepository.findByMaterialIdAndMaterial_UsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Não foi possível encontrar o estoque com o id informado"));

        return EstoqueResponseDTO.fromEntity(estoque);
    }

    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    public List<EstoqueResponseDTO> listarTodos(Long usuarioId, String nomeMaterial) {
        Empresa empresa = funcionarioService.getEmpresaUsuario(usuarioId);
        List<Estoque> estoques = estoqueRepository.findAllByMaterial_Usuario_Empresa(empresa);

        return estoques.stream()
                .filter(estoque -> estoque.getQuantidade() > 0)
                .map(EstoqueResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    //
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    public Page<EstoqueResponseDTO> listarTodosPaginado(Long usuarioId, String nomeMaterial, Pageable pageable) {
        if (nomeMaterial != null && !nomeMaterial.trim().isEmpty()) {
            return estoqueRepository
                    .findByMaterialUsuarioIdAndMaterialNomeContainingIgnoreCase(usuarioId, nomeMaterial, pageable)
                    .map(EstoqueResponseDTO::fromEntity);
        }
        return estoqueRepository
                .findAllByMaterial_UsuarioId(usuarioId, pageable)
                .map(EstoqueResponseDTO::fromEntity);
    }

    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    public DashboardDTO gerarResumoDashboard(Long usuarioId) {
        Empresa empresa = funcionarioService.getEmpresaUsuario(usuarioId);
        List<Estoque> estoques = estoqueRepository.findAllByMaterial_Usuario_Empresa(empresa);

        Float valorTotal = estoques.stream()
                .map(Estoque::getValorTotal)
                .reduce(0f, Float::sum);

        Integer totalMateriais = estoques.size();

        Float quantidadeTotalKg = estoques.stream()
                .map(Estoque::getQuantidade)
                .reduce(0f, Float::sum);

        Integer materiaisComEstoqueBaixo = (int) estoques.stream()
                .filter(e -> e.getQuantidade() < 100f)
                .count();

        return new DashboardDTO(totalMateriais, quantidadeTotalKg, valorTotal, materiaisComEstoqueBaixo);
    }

}