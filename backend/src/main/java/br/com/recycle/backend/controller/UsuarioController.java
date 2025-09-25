package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.AtualizarRoleDTO;
import br.com.recycle.backend.dto.UsuarioResponseDTO;
import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Usuários", description = "Gerenciamento de papéis de usuários")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final AuthService authService;

    public UsuarioController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(
        summary = "Atualizar papel de um usuário",
        description = "Permite que apenas GERENTE altere o papel (GERENTE/OPERADOR) de um usuário"
    )

    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Papel atualizado com sucesso",
            content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Usuário não encontrado",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Proibido",
            content = @Content
        )
    })

    @PreAuthorize("hasRole('GERENTE')")
    @PutMapping("/role")
    public ResponseEntity<UsuarioResponseDTO> atualizarRole(
        @Valid @RequestBody AtualizarRoleDTO dto
    ) {
        Usuario usuario = authService.atualizarRole(dto.getUsuarioId(), dto.getNovoRole());
        return ResponseEntity.ok(UsuarioResponseDTO.fromEntity(usuario));
    }
}
