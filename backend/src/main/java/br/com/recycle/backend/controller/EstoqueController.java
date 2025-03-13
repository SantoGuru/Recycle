package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.service.EstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estoques")
public class EstoqueController {

    private final EstoqueService estoqueService;

    @Autowired
    public EstoqueController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }

    @GetMapping
    public ResponseEntity<List<EstoqueResponseDTO>> listarTodos() {

        List<EstoqueResponseDTO> estoques = estoqueService.listarTodos();

        return ResponseEntity.ok(estoques);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstoqueResponseDTO> buscarPorId(@PathVariable Long id) {
        try {
            EstoqueResponseDTO estoque = estoqueService.buscarPorId(id);
            return ResponseEntity.ok(estoque);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
