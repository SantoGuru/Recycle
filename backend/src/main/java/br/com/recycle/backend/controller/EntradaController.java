package br.com.recycle.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

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

import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.List;

/**
 * Controller responsável por operações relacionadas às ENTRADAS de materiais.
 * 
 * - Registrar entradas (uma ou muitas)
 * - Listar entradas simples ou paginadas
 * 
 * Requer autenticação via token JWT e pode ser utilizado por GERENTE ou OPERADOR.
 */
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

    /**
     * Endpoint para registrar uma ou várias entradas de materiais.
     * As entradas são vinculadas ao usuário autenticado (via usuárioId extraído do request).
     */
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
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @PostMapping
    public ResponseEntity<List<EstoqueResponseDTO>> registrarEntrada(
        @Parameter(description = "Lista de entradas a serem registradas", required = true)
        @Valid @RequestBody List<EntradaRequestDTO> entradas,
        HttpServletRequest request) {

        // Recupera o ID do usuário autenticado (definido pelo filtro JWT)
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Registra todas as entradas recebidas
        List<EstoqueResponseDTO> resultados = entradaService.registrarEntradas(entradas, usuarioId);

        return ResponseEntity.status(HttpStatus.CREATED).body(resultados);
    }

    /**
     * Lista TODAS as entradas associadas ao usuário autenticado,
     * com opção de filtrar por intervalo de datas.
     */
    @Operation(
        summary = "Listar todas as entradas do usuário",
        description = "Requer autenticação (Bearer). Permissões: GERENTE e OPERADOR. " +
                      "Retorna uma lista com todas as entradas registradas pelo usuário autenticado. Permite filtrar por período.",
        parameters = {
            @Parameter(name = "dataInicio", description = "Data/hora inicial (yyyy-MM-dd'T'HH:mm:ss)", example = "2023-10-01T00:00:00"),
            @Parameter(name = "dataFim", description = "Data/hora final (yyyy-MM-dd'T'HH:mm:ss)", example = "2023-10-31T23:59:59")
        }
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Entradas listadas com sucesso",
            content = @Content(schema = @Schema(implementation = EntradaResponseDTO.class))
        ),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping
    public ResponseEntity<List<EntradaResponseDTO>> listarEntradas(
            HttpServletRequest request,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim
    ) {

        Long usuarioId = (Long) request.getAttribute("usuarioId");
        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Ajustes automáticos quando o usuário envia somente a data sem horário
        if (dataInicio != null && dataInicio.toLocalTime().equals(java.time.LocalTime.MIDNIGHT)) {
            dataInicio = dataInicio.with(java.time.LocalTime.MIN);
        }
        if (dataFim != null && dataFim.toLocalTime().equals(java.time.LocalTime.MIDNIGHT)) {
            dataFim = dataFim.with(java.time.LocalTime.MAX);
        }

        // Busca as entradas filtradas
        List<EntradaResponseDTO> entradas = entradaService.listarEntradas(usuarioId, dataInicio, dataFim);

        // Caso não haja registros, retorna 204 No Content
        if (entradas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(entradas);
    }

    /**
     * Lista entradas de forma PAGINADA, mantendo os filtros de data.
     * Útil para tabelas grandes ou paginação no frontend.
     */
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping("/paged")
    public ResponseEntity<Page<EntradaResponseDTO>> listarEntradasPaginado(
            HttpServletRequest request,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @ParameterObject @PageableDefault(size = 20) Pageable pageable)  {

        Long usuarioId = (Long) request.getAttribute("usuarioId");

        // Busca as entradas filtradas e paginadas
        Page<EntradaResponseDTO> page = entradaService.listarEntradasPaginado(usuarioId, dataInicio, dataFim, pageable);

        return ResponseEntity.ok(page);
    }
}
