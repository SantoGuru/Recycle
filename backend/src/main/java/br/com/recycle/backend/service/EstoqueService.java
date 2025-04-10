package br.com.recycle.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import br.com.recycle.backend.dto.DashboardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.model.Estoque;
import br.com.recycle.backend.repository.EstoqueRepository;

@Service
public class EstoqueService {

    private final EstoqueRepository estoqueRepository;

    @Autowired
    public EstoqueService(EstoqueRepository estoqueRepository) {
        this.estoqueRepository = estoqueRepository;
    }

    public EstoqueResponseDTO buscarPorId(Long id, Long usuarioId) {

        Estoque estoque = estoqueRepository.findByMaterialIdAndMaterial_UsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Não foi possível encontrar o estoque com o id informado"));	

        return EstoqueResponseDTO.fromEntity(estoque);
    }

    public List<EstoqueResponseDTO> listarTodos(Long usuarioId) {

        List<Estoque> estoques = estoqueRepository.findAllByMaterial_UsuarioId(usuarioId);

        return estoques.stream()
                .map(EstoqueResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public DashboardDTO gerarResumoDashboard(Long usuarioId) {
        List<Estoque> estoques = estoqueRepository.findAllByMaterial_UsuarioId(usuarioId);

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
