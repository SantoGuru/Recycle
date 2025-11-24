package br.com.recycle.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import br.com.recycle.backend.dto.MaterialRequestDTO;
import br.com.recycle.backend.dto.MaterialResponseDTO;
import br.com.recycle.backend.service.MaterialService;
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
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller responsável pelo GERENCIAMENTO DE MATERIAIS.
 *
 * Observações:
 * - Apenas GERENTE pode criar, editar ou deletar materiais.
 * - GERENTE e OPERADOR podem visualizar.
 * - Materiais são sempre vinculados à EMPRESA do usuário autenticado.
 * - A exclusão é bloqueada se o material possuir saldo em estoque.
 */
@Log
@Tag(name = "Materiais", description = "Gerencia os materiais cadastrados pelo usuário")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/materiais")
public class MaterialController {

    private final MaterialService materialService;

    @Autowired
    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    /**
     * Cria novo material vinculado ao GERENTE autenticado.
     */
    @Operation(
        summary = "Criar material",
        description = "Apenas GERENTE pode criar materiais. Registra um novo material vinculado à empresa do usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Material criado com sucesso",
            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))
        ),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasRole('GERENTE')")
    @PostMapping
    public ResponseEntity<MaterialResponseDTO> criar(
            @Parameter(description = "Dados do material a ser criado", required = true)
            @Valid @RequestBody MaterialRequestDTO dto,
            HttpServletRequest request) {

        Long usuarioId = (Long) request.getAttribute("usuarioId");

        MaterialResponseDTO materialCriado = materialService.criar(dto, usuarioId);

        return ResponseEntity.status(HttpStatus.CREATED).body(materialCriado);
    }

    /**
     * Lista todos os materiais do usuário autenticado, com filtro opcional por nome.
     */
    @Operation(
        summary = "Listar materiais",
        description = "GERENTE e OPERADOR podem visualizar os materiais. Permite filtrar por nome.",
        parameters = {
            @Parameter(name = "nome", description = "Filtro por nome (contém, case-insensitive)", example = "Papel")
        }
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista retornada com sucesso",
            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))
        ),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> listarTodos(
            HttpServletRequest request,
            @RequestParam(required = false) String nome) {

        Long usuarioId = (Long) request.getAttribute("usuarioId");

        List<MaterialResponseDTO> materiais = materialService.listarTodos(usuarioId, nome);

        return ResponseEntity.ok(materiais);
    }

    /**
     * Listagem paginada de materiais.
     */
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping("/paged")
    public ResponseEntity<Page<MaterialResponseDTO>> listarTodosPaginado(
            HttpServletRequest request,
            @RequestParam(required = false) String nome,
            @ParameterObject @PageableDefault(size = 20) Pageable pageable) {

        Long usuarioId = (Long) request.getAttribute("usuarioId");

        Page<MaterialResponseDTO> page = materialService.listarTodosPaginado(usuarioId, nome, pageable);

        return ResponseEntity.ok(page);
    }

    /**
     * Busca material por ID.
     */
    @Operation(
        summary = "Buscar material por ID",
        description = "Disponível para GERENTE e OPERADOR. Retorna material pertencente ao usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Material encontrado",
            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))
        ),
        @ApiResponse(responseCode = "404", description = "Material não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> buscarPorId(
        @Parameter(description = "ID do material", required = true)
        @PathVariable Long id,
        HttpServletRequest request) {

        try {
            Long usuarioId = (Long) request.getAttribute("usuarioId");
            MaterialResponseDTO material = materialService.buscarPorId(id, usuarioId);
            return ResponseEntity.ok(material);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Atualiza material existente. Apenas GERENTE pode atualizar.
     */
    @Operation(
        summary = "Atualizar material",
        description = "Apenas GERENTE pode atualizar um material já existente."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Material não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PreAuthorize("hasRole('GERENTE')")
    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> atualizar(
        @Parameter(description = "ID do material", required = true)
        @PathVariable Long id,
        @Parameter(description = "Novos dados do material", required = true)
        @Valid @RequestBody MaterialRequestDTO dto,
        HttpServletRequest request) {

        try {
            Long usuarioId = (Long) request.getAttribute("usuarioId");

            MaterialResponseDTO materialAtualizado = materialService.atualizar(id, dto, usuarioId);

            return ResponseEntity.ok(materialAtualizado);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Deleta material. Apenas GERENTE pode deletar.
     * A exclusão é bloqueada se o material tiver saldo em estoque.
     */
    @Operation(
        summary = "Remover material",
        description = "Apenas GERENTE pode excluir materiais. " +
                      "A remoção é bloqueada se existir saldo em estoque."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Material removido"),
        @ApiResponse(responseCode = "404", description = "Material não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autorizado"),
        @ApiResponse(responseCode = "500", description = "Erro interno")
    })
    @PreAuthorize("hasRole('GERENTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
        @Parameter(description = "ID do material", required = true)
        @PathVariable Long id,
        HttpServletRequest request) {

        try {
            Long usuarioId = (Long) request.getAttribute("usuarioId");

            materialService.delete(id, usuarioId);

            return ResponseEntity.ok(Map.of("message", "Material deletado com sucesso!"));

        } catch (IllegalStateException e) {
            // Erro de regra de negócio (ex: possui saldo em estoque)
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));

        } catch (RuntimeException e) {

            if (e.getMessage().contains("não encontrado") ||
                e.getMessage().contains("não tem permissão")) {

                return ResponseEntity.notFound().build();
            }

            // Erro inesperado
            return ResponseEntity.status(500).body(Map.of("error", "Erro interno: " + e.getMessage()));
        }
    }
}
