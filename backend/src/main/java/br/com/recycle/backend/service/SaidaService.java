package br.com.recycle.backend.service;

import br.com.recycle.backend.dto.SaidaRequestDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.model.Estoque;
import br.com.recycle.backend.model.Material;
import br.com.recycle.backend.model.Saida;
import br.com.recycle.backend.repository.EstoqueRepository;
import br.com.recycle.backend.repository.SaidaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SaidaService {

    private final SaidaRepository saidaRepository;
    private final EstoqueRepository estoqueRepository;

    public SaidaService(SaidaRepository saidaRepository, EstoqueRepository estoqueRepository) {
        this.saidaRepository = saidaRepository;
        this.estoqueRepository = estoqueRepository;
    }

    @Transactional
    public SaidaResponseDTO registrarSaida(SaidaRequestDTO dto, Long usuarioId) {
        Estoque estoque = estoqueRepository.findByMaterialIdAndMaterial_UsuarioId(dto.getMaterialId(), usuarioId)
            .orElseThrow(() -> new RuntimeException("Estoque não encontrado"));

        if (estoque.getQuantidade() < dto.getQuantidade()) {
            throw new RuntimeException("Quantidade insuficiente no estoque");
        }

        estoque.setQuantidade(estoque.getQuantidade() - dto.getQuantidade());
        estoqueRepository.save(estoque);

        Saida saida = new Saida();
        saida.setQuantidade(dto.getQuantidade());
        saida.setUsuarioId(usuarioId);
        saida.setMaterial(estoque.getMaterial()); 
        saida.setEstoque(estoque);

        return SaidaResponseDTO.fromEntity(saidaRepository.save(saida));
    }
} 
