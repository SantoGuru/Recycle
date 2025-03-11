package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.MaterialRequestDTO;
import br.com.recycle.backend.dto.MaterialResponseDTO;
import br.com.recycle.backend.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materiais")
public class MaterialController {

    private final MaterialService materialService;

    @Autowired
    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @PostMapping
    public ResponseEntity<MaterialResponseDTO> criar(@Valid @RequestBody MaterialRequestDTO dto) {

        MaterialResponseDTO materialCriado = materialService.criar(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(materialCriado);
    }

    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> listarTodos() {

        List<MaterialResponseDTO> materiais = materialService.listarTodos();

        return ResponseEntity.ok(materiais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> buscarPorId(@PathVariable Long id) {
        try {
            MaterialResponseDTO material = materialService.buscarPorId(id);
            return ResponseEntity.ok(material);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
