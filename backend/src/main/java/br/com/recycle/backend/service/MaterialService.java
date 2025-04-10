package br.com.recycle.backend.service;

import br.com.recycle.backend.dto.MaterialRequestDTO;
import br.com.recycle.backend.dto.MaterialResponseDTO;
import br.com.recycle.backend.model.Material;
import br.com.recycle.backend.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;

    @Autowired
    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    public MaterialResponseDTO criar(MaterialRequestDTO dto, Long usuarioId) {

        if (materialRepository.existsByNomeAndUsuarioId(dto.getNome(), usuarioId)) {
            throw new RuntimeException("Já existe um material com esse nome");
        }

        Material material = new Material();
        material.setNome(dto.getNome());
        material.setDescricao(dto.getDescricao());
        material.setUnidade(dto.getUnidade());
        material.setUsuarioId(usuarioId);

        Material materialSalvo = materialRepository.save(material);
        return MaterialResponseDTO.fromEntity(materialSalvo);
    }

    public MaterialResponseDTO buscarPorId(Long id, Long usuarioId) {

        Material material = materialRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));

        return MaterialResponseDTO.fromEntity(material);
    }

    public List<MaterialResponseDTO> listarTodos(Long usuarioId) {

        List<Material> materiais = materialRepository.findAllByUsuarioId(usuarioId);

        return materiais.stream()
                .map(MaterialResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public MaterialResponseDTO atualizar(Long id, MaterialRequestDTO dto, Long usuarioId) {
        Material material = materialRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));

        if (!material.getNome().equals(dto.getNome()) &&
                materialRepository.existsByNomeAndUsuarioId(dto.getNome(), usuarioId)) {
            throw new RuntimeException("Já existe um material com este nome");
        }

        material.setNome(dto.getNome());
        material.setDescricao(dto.getDescricao());
        material.setUnidade(dto.getUnidade());

        Material materialAtualizado = materialRepository.save(material);
        return MaterialResponseDTO.fromEntity(materialAtualizado);
    }
}
