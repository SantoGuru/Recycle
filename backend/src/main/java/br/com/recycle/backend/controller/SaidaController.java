package br.com.recycle.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import br.com.recycle.backend.dto.SaidaRequestDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.service.SaidaService;

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

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller responsável por gerenciar SAÍDAS de materiais.
 *
 * Observações:
 * - GERENTE e OPERADOR podem registrar e listar saídas.
 * - Todas as operações ocorrem dentro da empresa do usuário autenticado.
 * - Permite filtros por intervalo de datas e listagem paginada.
 */
@Tag(name = "Saídas", description = "Gerencia o registro e listagem de saídas de materiais do estoque")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/saidas")
public class SaidaController {

    private final SaidaService saidaService;

    public SaidaController(SaidaService saidaService) {
        this.saidaService = saidaService;
    }

    /**
     * Registra uma ou várias saídas de materiais.
     */
    @Operation(
        summary = "Registrar saída(s) de material",
        description = "GERENTE e OPERADOR podem registrar saídas de materiais. " +
                      "Aceita lista de saídas e retorna o resultado das operações."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Saída registrada com sucesso",
            content = @Content(schema = @Schema(implementation = SaidaResponseDTO.class))
        ),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @PostMapping
    public ResponseEntity<List<SaidaResponseDTO>> registrarSaida(
        @Parameter(description = "Lista das saídas a serem registradas", required = true)
        @Valid @RequestBody List<SaidaRequestDTO> saidas,
        HttpServletRequest request
    ) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");

        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<SaidaResponseDTO> resultados = saidaService.registrarSaidas(saidas, usuarioId);

        return ResponseEntity.status(HttpStatus.CREATED).body(resultados);
    }

    /**
     * Lista todas as saídas do usuário, com possibilidade de filtrar por período.
     */
    @Operation(
        summary = "Listar todas as saídas do usuário",
        description = "Retorna todas as saídas registradas pelo usuário autenticado. " +
                      "Permite filtrar por intervalo de datas.",
        parameters = {
            @Parameter(
                name = "dataInicio",
                description = "Filtrar saídas a partir desta data (ISO: yyyy-MM-dd'T'HH:mm:ss)",
                example = "2023-10-01T00:00:00"
            ),
            @Parameter(
                name = "dataFim",
                description = "Filtrar saídas até esta data (ISO: yyyy-MM-dd'T'HH:mm:ss)",
                example = "2023-10-31T23:59:59"
            )
        }
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Saídas listadas com sucesso"),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping
    public ResponseEntity<List<SaidaResponseDTO>> listarSaidas(
            HttpServletRequest request,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim
    ) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");

        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Ajuste automático para datas sem hora
        if (dataInicio != null && dataInicio.toLocalTime().equals(java.time.LocalTime.MIDNIGHT)) {
            dataInicio = dataInicio.with(java.time.LocalTime.MIN);
        }
        if (dataFim != null && dataFim.toLocalTime().equals(java.time.LocalTime.MIDNIGHT)) {
            dataFim = dataFim.with(java.time.LocalTime.MAX);
        }

        List<SaidaResponseDTO> saidas = saidaService.listarSaidas(usuarioId, dataInicio, dataFim);

        if (saidas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(saidas);
    }

    /**
     * Lista paginada de saídas com filtros opcionais por período.
     */
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping("/paged")
    public ResponseEntity<Page<SaidaResponseDTO>> listarSaidasPaginado(
            HttpServletRequest request,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @ParameterObject @PageableDefault(size = 20) Pageable pageable) {

        Long usuarioId = (Long) request.getAttribute("usuarioId");

        Page<SaidaResponseDTO> page = saidaService.listarSaidasPaginado(usuarioId, dataInicio, dataFim, pageable);

        return ResponseEntity.ok(page);
    }
}
