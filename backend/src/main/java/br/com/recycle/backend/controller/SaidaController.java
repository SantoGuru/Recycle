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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

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
                      "Retorna uma lista com todas as saídas registradas pelo usuário autenticado."
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
   public ResponseEntity<Page<SaidaResponseDTO>> listarSaidas(
        HttpServletRequest request,
        @Parameter(description = "Número da página (0-index)") @RequestParam(defaultValue = "0") int page,
        @Parameter(description = "Tamanho da página") @RequestParam(defaultValue = "20") int size,
        @Parameter(description = "Campo de ordenação") @RequestParam(defaultValue = "id") String sort) {

    Long usuarioId = (Long) request.getAttribute("usuarioId");
    Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());
    Page<SaidaResponseDTO> saidas = saidaService.listarSaidasPaginado(usuarioId, pageable);
    return ResponseEntity.ok(saidas);
}
    }
