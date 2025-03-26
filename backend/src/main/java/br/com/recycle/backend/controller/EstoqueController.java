package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.service.EstoqueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Tag(name = "Estoque", description = "Endpoints para o gerenciamento de estoques")
@RestController
@RequestMapping("/api/estoques")
public class EstoqueController {

    private final EstoqueService estoqueService;

    @Autowired
    public EstoqueController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }
    @Operation(
        summary = "Listar todos os Estoques",
        description = "Retorna uma lista com todos os registros de Estoque disponiveis"
    )

    @GetMapping
    public ResponseEntity<List<EstoqueResponseDTO>> listarTodos(HttpServletRequest request) {

        Long usuarioId = (Long) request.getAttribute("usuarioId");
        List<EstoqueResponseDTO> estoques = estoqueService.listarTodos(usuarioId);

        return ResponseEntity.ok(estoques);
    }
    @Operation(
        summary = "Buscar Estoque por ID",
        description = "Retorna um registro de estoque especifico com base no ID informado"
    )

    @GetMapping("/{id}")
    public ResponseEntity<EstoqueResponseDTO> buscarPorId(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("usuarioId");
            EstoqueResponseDTO estoque = estoqueService.buscarPorId(id, usuarioId);
            return ResponseEntity.ok(estoque);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
