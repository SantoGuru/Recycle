package br.com.recycle.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
//

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
                      "Retorna uma lista com todas as entradas registradas pelo usuário autenticado. Permite filtrar por período.",
        parameters = {
            @Parameter(name = "dataInicio", description = "Filtrar entradas a partir desta data/hora (formato ISO: yyyy-MM-dd'T'HH:mm:ss)", required = false, example = "2023-10-01T00:00:00"),
            @Parameter(name = "dataFim", description = "Filtrar entradas até esta data/hora (formato ISO: yyyy-MM-dd'T'HH:mm:ss)", required = false, example = "2023-10-31T23:59:59")
        }
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

        if (dataInicio != null && dataInicio.toLocalTime().equals(java.time.LocalTime.MIDNIGHT)) {
            dataInicio = dataInicio.with(java.time.LocalTime.MIN); 
        }
        if (dataFim != null && dataFim.toLocalTime().equals(java.time.LocalTime.MIDNIGHT)) {
            dataFim = dataFim.with(java.time.LocalTime.MAX); 
        }

        List<EntradaResponseDTO> entradas = entradaService.listarEntradas(usuarioId, dataInicio, dataFim);
        if (entradas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(entradas);
    }
//    
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping("/paged")
    public ResponseEntity<Page<EntradaResponseDTO>> listarEntradasPaginado(
            HttpServletRequest request,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @ParameterObject @PageableDefault(size = 20) Pageable pageable)  {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        Page<EntradaResponseDTO> page = entradaService.listarEntradasPaginado(usuarioId, dataInicio, dataFim, pageable);
        return ResponseEntity.ok(page);
    }

}
