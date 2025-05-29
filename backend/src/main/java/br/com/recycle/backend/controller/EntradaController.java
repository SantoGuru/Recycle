package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EntradaRequestDTO;
import br.com.recycle.backend.dto.EntradaResponseDTO;
import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.service.EntradaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @Parameter(description = "Lista de entradas a serem registradas", required = true)
            @Valid @RequestBody List<EntradaRequestDTO> entradas,
            @Parameter(hidden = true) @AuthenticationPrincipal Long usuarioId) {
        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<EstoqueResponseDTO> resultados = entradaService.registrarEntradas(entradas, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultados);
    }

    @Operation(
            summary = "Listar todas as entradas do usuário",
            description = "Retorna uma lista com todas as entradas registradas pelo usuário autenticado"
    )
    @GetMapping
    public ResponseEntity<List<EntradaResponseDTO>> listarEntradas(
        @Parameter(hidden = true) @AuthenticationPrincipal Long usuarioId) {
        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<EntradaResponseDTO> entradas = entradaService.listarEntradas(usuarioId);
        if (entradas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(entradas);
    }
}