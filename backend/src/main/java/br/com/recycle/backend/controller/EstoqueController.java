package br.com.recycle.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

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

/**
 * Controller responsável pelos endpoints de ESTOQUE.
 * Permite:
 * - Listar todos os estoques
 * - Listar de forma paginada
 * - Buscar estoque por ID
 *
 * Todos os endpoints exigem autenticação JWT e permitem acesso
 * a usuários com papel GERENTE ou OPERADOR.
 */
@Tag(name = "Estoque", description = "Endpoints para o gerenciamento de estoques")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/estoques")
public class EstoqueController {

    // Serviço que contém a lógica de negócios relacionada ao estoque
    private final EstoqueService estoqueService;

    public EstoqueController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }

    /**
     * Lista todos os estoques com quantidade maior que 0,
     * pertencentes ao usuário autenticado.
     */
    @Operation(
        summary = "Listar todos os Estoques",
        description = "Requer autenticação (Bearer). Permissões: GERENTE e OPERADOR. " +
                      "Retorna todos os registros de estoque do usuário (apenas com quantidade > 0). Permite filtrar por nome do material.",
        parameters = {
            @Parameter(name = "nomeMaterial",
                       description = "Filtrar estoques cujo nome contenha o valor informado (case-insensitive)",
                       required = false,
                       schema = @Schema(implementation = String.class),
                       example = "Plástico")
        }
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista de estoques retornada com sucesso",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = EstoqueResponseDTO.class)))
        ),
        @ApiResponse(responseCode = "204", description = "Sem conteúdo"),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping
    public ResponseEntity<List<EstoqueResponseDTO>> listarTodos(
            HttpServletRequest request,
            @RequestParam(required = false) String nomeMaterial
    ) {

        // Obtém o ID do usuário autenticado (definido pelo filtro JWT)
        Long usuarioId = (Long) request.getAttribute("usuarioId");

        // Busca os estoques considerando o filtro por nome
        List<EstoqueResponseDTO> estoques = estoqueService.listarTodos(usuarioId, nomeMaterial);

        if (estoques == null || estoques.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(estoques);
    }

    /**
     * Lista de estoques com paginação.
     * Útil para tabelas grandes no frontend.
     */
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping("/paged")
    public ResponseEntity<Page<EstoqueResponseDTO>> listarTodosPaginado(
            HttpServletRequest request,
            @RequestParam(required = false) String nomeMaterial,
            @ParameterObject @PageableDefault(size = 20) Pageable pageable)  {

        Long usuarioId = (Long) request.getAttribute("usuarioId");

        // Retorna uma lista paginada de estoques
        Page<EstoqueResponseDTO> page =
                estoqueService.listarTodosPaginado(usuarioId, nomeMaterial, pageable);

        return ResponseEntity.ok(page);
    }

    /**
     * Busca um estoque específico pelo ID do material.
     * O registro deve pertencer ao usuário autenticado.
     */
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
        @ApiResponse(responseCode = "404", description = "Estoque não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping("/{id}")
    public ResponseEntity<EstoqueResponseDTO> buscarPorId(
        @Parameter(description = "ID do estoque (igual ao ID do material)", required = true)
        @PathVariable Long id,
        HttpServletRequest request) {

        try {
            Long usuarioId = (Long) request.getAttribute("usuarioId");

            // Busca o estoque considerando o usuário autenticado
            EstoqueResponseDTO estoque = estoqueService.buscarPorId(id, usuarioId);

            return ResponseEntity.ok(estoque);

        } catch (RuntimeException e) {
            // Caso o estoque não exista ou não pertença ao usuário
            return ResponseEntity.notFound().build();
        }
    }
}
