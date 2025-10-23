package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.service.EstoqueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Estoque", description = "Endpoints para o gerenciamento de estoques")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/estoques")
public class EstoqueController {

    private final EstoqueService estoqueService;

    public EstoqueController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }

    @Operation(
        summary = "Listar todos os Estoques",
        description = "Requer autenticação (Bearer). Permissões: GERENTE e OPERADOR. " +
                      "Retorna todos os registros de estoque do usuário (apenas com quantidade > 0). Permite filtrar por nome do material.", 
        parameters = { 
            @Parameter(name = "nomeMaterial", description = "Filtrar estoques cujo nome do material contenha o valor informado (case-insensitive)", required = false, schema = @Schema(implementation = String.class), example = "Plástico")
        }
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista de estoques retornada com sucesso",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = EstoqueResponseDTO.class)))
        ),
        @ApiResponse(
            responseCode = "204",
            description = "Sem conteúdo (não há estoques para o usuário)",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado - token ausente ou inválido",
            content = @Content
        )
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping
    public ResponseEntity<List<EstoqueResponseDTO>> listarTodos(
            HttpServletRequest request,
            @RequestParam(required = false) String nomeMaterial 
    ) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        List<EstoqueResponseDTO> estoques = estoqueService.listarTodos(usuarioId, nomeMaterial); 
        if (estoques == null || estoques.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(estoques);
    }

    @Operation(
        summary = "Buscar Estoque por ID",
        description = "Requer autenticação (Bearer). Permissões: GERENTE e OPERADOR. " +
                      "Retorna um registro de estoque específico (por ID do material) do usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Estoque encontrado com sucesso",
            content = @Content(schema = @Schema(implementation = EstoqueResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Estoque não encontrado ou não pertence ao usuário",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado - token ausente ou inválido",
            content = @Content
        )
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping("/{id}")
    public ResponseEntity<EstoqueResponseDTO> buscarPorId(
        @Parameter(description = "ID do estoque (igual ao ID do material)", required = true)
        @PathVariable Long id,
        HttpServletRequest request) {
        try {
            Long usuarioId = (Long) request.getAttribute("usuarioId");
            EstoqueResponseDTO estoque = estoqueService.buscarPorId(id, usuarioId);
            return ResponseEntity.ok(estoque);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
