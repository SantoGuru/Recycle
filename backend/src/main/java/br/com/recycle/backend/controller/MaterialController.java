package br.com.recycle.backend.controller;
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
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


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

    @Operation(
        summary = "Criar material",
        description = "Registra um novo material para o usuário autenticado"
    )
    
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Material criado com sucesso",
            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos fornecidos",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado - token ausente ou inválido",
            content = @Content
        )
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

    @Operation(
        summary = "Listar materiais",
        description = "Retorna todos os materiais cadastrados pelo usuário"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista de materiais retornada com sucesso",
            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado - token ausente ou inválido",
            content = @Content
        )
    })
    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> listarTodos(HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        List<MaterialResponseDTO> materiais = materialService.listarTodos(usuarioId);

        return ResponseEntity.ok(materiais);
    }

    @Operation(
        summary = "Buscar material por ID",
        description = "Retorna os dados de um material específico pertencente ao usuário"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Material encontrado com sucesso",
            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Material não encontrado",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado - token ausente ou inválido",
            content = @Content
        )
    })

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

    @Operation(
        summary = "Atualizar material",
        description = "Atualiza os dados de um material existente"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Material atualizado com sucesso",
            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Material não encontrado",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado - token ausente ou inválido",
            content = @Content
        )
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

    @Operation(
        summary = "Remover material",
        description = "Deleta um material do usuário com base no ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Material removido com sucesso"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Material não encontrado",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado - token ausente ou inválido",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500", 
            description = "Erro interno ao deletar",
            content = @Content
        )
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
            return ResponseEntity.ok()
                    .body(Map.of("message", "Material deletado com sucesso!"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            System.out.println("Erro ao deletar material: " + e.getMessage());
            e.printStackTrace();

            if (e.getMessage().contains("não encontrado") || e.getMessage().contains("não tem permissão")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.status(500)
                        .body(Map.of("error", "Erro interno: " + e.getMessage()));
            }
        }
    }
}
