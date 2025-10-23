package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EntradaRequestDTO;
import br.com.recycle.backend.dto.EntradaResponseDTO;
import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.service.EntradaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;

@Tag(name = "Entradas", description = "Endpoints relacionados ao registro e listagem de entradas de materiais")
@SecurityRequirement(name = "bearerAuth")
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
        description = "Requer autenticação (Bearer). Permissões: GERENTE e OPERADOR. " +
                      "Registra uma nova entrada ou uma lista de entradas no estoque para o usuário autenticado."
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
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @PostMapping
    public ResponseEntity<List<EstoqueResponseDTO>> registrarEntrada(
        @Parameter(description = "Lista de entradas a serem registradas", required = true)
        @Valid @RequestBody List<EntradaRequestDTO> entradas,
        HttpServletRequest request) {

        Long usuarioId = (Long) request.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<EstoqueResponseDTO> resultados = entradaService.registrarEntradas(entradas, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultados);
    }

    @Operation(
        summary = "Listar todas as entradas do usuário",
        description = "Requer autenticação (Bearer). Permissões: GERENTE e OPERADOR. " +
                      "Retorna uma lista com todas as entradas registradas pelo usuário autenticado."
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
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
public ResponseEntity<Page<EntradaResponseDTO>> listarEntradas(
        HttpServletRequest request,
        @Parameter(description = "Número da página (0-index)") @RequestParam(defaultValue = "0") int page,
        @Parameter(description = "Tamanho da página") @RequestParam(defaultValue = "20") int size,
        @Parameter(description = "Campo de ordenação") @RequestParam(defaultValue = "id") String sort) {

    Long usuarioId = (Long) request.getAttribute("usuarioId");
    Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending()); // exemplo default desc
    Page<EntradaResponseDTO> entradas = entradaService.listarEntradasPaginado(usuarioId, pageable);
    return ResponseEntity.ok(entradas);
        }
    }