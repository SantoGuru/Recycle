package br.com.recycle.backend.service;

import br.com.recycle.backend.dto.MaterialRequestDTO;
import br.com.recycle.backend.dto.MaterialResponseDTO;
import br.com.recycle.backend.model.Material;
import br.com.recycle.backend.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class MaterialService {

    private final MaterialRepository materialRepository;

    @Autowired
    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    public MaterialResponseDTO criar(MaterialRequestDTO dto) {
        if (materialRepository.existsByNome(dto.getNome())) {
            throw new RuntimeException("Já existe um material com esse nome");
        }

        Material material = new Material();
        material.setNome(dto.getNome());
        material.setDescricao(dto.getDescricao());
        material.setUnidade(dto.getUnidade());

        Material materialSalvo = materialRepository.save(material);
        return MaterialResponseDTO.fromEntity(materialSalvo);
    }
}
