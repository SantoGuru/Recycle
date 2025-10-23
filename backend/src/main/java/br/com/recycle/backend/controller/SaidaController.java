package br.com.recycle.backend.controller;

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

@Tag(name = "Saídas", description = "Gerencia o registro e listagem de saídas de materiais do estoque")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/saidas")
public class SaidaController {

    private final SaidaService saidaService;

    public SaidaController(SaidaService saidaService) {
        this.saidaService = saidaService;
    }

    @Operation(
        summary = "Registrar saída(s) de material",
        description = "Requer autenticação (Bearer). Permissões: GERENTE e OPERADOR. " +
                      "Registra uma ou mais saídas de materiais para o usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Saída registrada com sucesso",
            content = @Content(schema = @Schema(implementation = SaidaResponseDTO.class))
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

    @Operation(
        summary = "Listar todas as saídas do usuário",
        description = "Requer autenticação (Bearer). Permissões: GERENTE e OPERADOR. " +
                      "Retorna uma lista com todas as saídas registradas pelo usuário autenticado. Permite filtrar por período.", 
        parameters = {
            @Parameter(name = "dataInicio", description = "Filtrar saídas a partir desta data/hora (formato ISO: yyyy-MM-dd'T'HH:mm:ss)", required = false, example = "2023-10-01T00:00:00"),
            @Parameter(name = "dataFim", description = "Filtrar saídas até esta data/hora (formato ISO: yyyy-MM-dd'T'HH:mm:ss)", required = false, example = "2023-10-31T23:59:59")
        }
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Saídas listadas com sucesso",
            content = @Content(schema = @Schema(implementation = SaidaResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado",
            content = @Content
        )
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

}