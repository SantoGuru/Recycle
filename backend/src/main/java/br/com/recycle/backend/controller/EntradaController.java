package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EntradaRequestDTO;
import br.com.recycle.backend.dto.EntradaResponseDTO;
import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.service.EntradaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Entradas", description = "Endpoints relacionados ao registro e listagem de entradas de materiais")
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
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Entradas registradas com sucesso",
            content = @Content(schema = @Schema(implementation = EstoqueResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado",
            content = @Content
        )
    })
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
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Entradas listadas com sucesso",
            content = @Content(schema = @Schema(implementation = EntradaResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado",
            content = @Content
        )
    })
    @GetMapping
    public ResponseEntity<List<EntradaResponseDTO>> listarEntradas(HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        List<EntradaResponseDTO> entradas = entradaService.listarEntradas(usuarioId);
        return ResponseEntity.ok(entradas);
    }
}
