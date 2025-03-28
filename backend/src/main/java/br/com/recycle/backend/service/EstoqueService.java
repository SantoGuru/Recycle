package br.com.recycle.backend.service;

import java.util.List;
import java.util.stream.Collectors;

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
}
