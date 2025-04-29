package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.MaterialRequestDTO;
import br.com.recycle.backend.dto.MaterialResponseDTO;
import br.com.recycle.backend.service.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Materiais", description = "Gerencia os materiais cadastrados pelo usuário")
@RestController
@RequestMapping("/api/materiais")
public class MaterialController {

    private final MaterialService materialService;

    @Autowired
    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

     @Operation(
        summary = "Criar material",
        description = "Registra um novo material para o usuário autenticado"
    )

    @PostMapping
    public ResponseEntity<MaterialResponseDTO> criar(
            @Valid @RequestBody MaterialRequestDTO dto,
            HttpServletRequest request) {

        Long usuarioId = (Long) request.getAttribute("usuarioId");
        MaterialResponseDTO materialCriado = materialService.criar(dto, usuarioId);

        return ResponseEntity.status(HttpStatus.CREATED).body(materialCriado);
    }

    @Operation(
        summary = "Listar materiais",
        description = "Retorna todos os materiais cadastrados pelo usuário"
    )

    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> listarTodos(HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        List<MaterialResponseDTO> materiais = materialService.listarTodos(usuarioId);

        return ResponseEntity.ok(materiais);
    }

    @Operation(
        summary = "Buscar material por ID",
        description = "Retorna os dados de um material específico pertencente ao usuário"
    )

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> buscarPorId(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("usuarioId");
            MaterialResponseDTO material = materialService.buscarPorId(id, usuarioId);
            return ResponseEntity.ok(material);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
        summary = "Atualizar material",
        description = "Atualiza os dados de um material existente"
    )

    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody MaterialRequestDTO dto,
            HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("usuarioId");
            MaterialResponseDTO materialAtualizado = materialService.atualizar(id, dto, usuarioId);
            return ResponseEntity.ok(materialAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @Operation(
        summary = "Remover material",
        description = "Deleta um material do usuário com base no ID"
    )

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("usuarioId");
            materialService.delete(id, usuarioId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
