package br.com.recycle.backend.service;

import br.com.recycle.backend.dto.MaterialRequestDTO;
import br.com.recycle.backend.dto.MaterialResponseDTO;
import br.com.recycle.backend.model.Entrada;
import br.com.recycle.backend.model.Estoque;
import br.com.recycle.backend.model.Material;
import br.com.recycle.backend.model.Saida;
import br.com.recycle.backend.repository.EntradaRepository;
import br.com.recycle.backend.repository.EstoqueRepository;
import br.com.recycle.backend.repository.MaterialRepository;
import br.com.recycle.backend.repository.SaidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final EstoqueRepository estoqueRepository;
    private final EntradaRepository entradaRepository;
    private final SaidaRepository saidaRepository;

    @Autowired
    public MaterialService(MaterialRepository materialRepository,
                           EstoqueRepository estoqueRepository,
                           EntradaRepository entradaRepository,
                           SaidaRepository saidaRepository) {
        this.materialRepository = materialRepository;
        this.estoqueRepository = estoqueRepository;
        this.entradaRepository = entradaRepository;
        this.saidaRepository = saidaRepository;
    }
    @PreAuthorize("hasRole('GERENTE')")
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
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    public MaterialResponseDTO buscarPorId(Long id, Long usuarioId) {

        Material material = materialRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Material não encontrado"));

        return MaterialResponseDTO.fromEntity(material);
    }
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    public List<MaterialResponseDTO> listarTodos(Long usuarioId) {

        List<Material> materiais = materialRepository.findAllByUsuarioId(usuarioId);

        return materiais.stream()
                .map(MaterialResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    @PreAuthorize("hasRole('GERENTE')")
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
    @PreAuthorize("hasRole('GERENTE')")
    @Transactional
    public void delete(Long id, Long usuarioId) {
        Material material = materialRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RuntimeException("Material não encontrado ou você não tem permissão para excluí-lo"));

        Optional<Estoque> estoqueOpt = estoqueRepository.findByMaterialIdAndMaterial_UsuarioId(id, usuarioId);
        if (estoqueOpt.isPresent() && estoqueOpt.get().getQuantidade() > 0) {
            throw new IllegalStateException("Não é possível excluir este material pois ainda há " +
                    estoqueOpt.get().getQuantidade() + "kg em estoque. Para excluir o material, primeiro retire todo o estoque através de saídas.");
        }

        List<Entrada> entradas = entradaRepository.findByMaterialId(id);
        if (!entradas.isEmpty()) {
            entradaRepository.deleteAll(entradas);
        }

        List<Saida> saidas = saidaRepository.findByMaterialId(id);
        if (!saidas.isEmpty()) {
            saidaRepository.deleteAll(saidas);
        }

        if (estoqueOpt.isPresent()) {
            estoqueRepository.delete(estoqueOpt.get());
        }

        materialRepository.delete(material);
    }
}