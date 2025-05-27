package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EntradaRequestDTO;
import br.com.recycle.backend.dto.EntradaResponseDTO;
import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.service.EntradaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name ="Entradas", description = "Endpoints relacionados ao registro e listagem de entradas de materiais")
@RestController
@RequestMapping("/api/entradas")
public class EntradaController {

    private final EntradaService entradaService;

    @Autowired
    public EntradaController(EntradaService entradaService) {
        this.entradaService = entradaService;
    }

    @Operation(
            summary = "Registrar uma ou mais entradas de materiais",
            description = "Registra uma nova entrada ou uma lista de entradas no estoque para o Usuário autenticado"
    )
    @PostMapping
    public ResponseEntity<List<EstoqueResponseDTO>> registrarEntrada(
            @RequestBody List<EntradaRequestDTO> entradas,
            HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        List<EstoqueResponseDTO> resultados = entradaService.registrarEntradas(entradas, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultados);
    }

    @Operation(
            summary = "Listar todas as entradas do usuário",
            description = "Retorna uma lista com todas as entradas registradas pelo usuário autenticado"
    )
    @GetMapping
    public ResponseEntity<List<EntradaResponseDTO>> listarEntradas(HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        List<EntradaResponseDTO> entradas = entradaService.listarEntradas(usuarioId);
        return ResponseEntity.ok(entradas);
    }
}