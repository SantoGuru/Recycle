package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.AtualizarRoleDTO;
import br.com.recycle.backend.dto.RegistroDTO;
import br.com.recycle.backend.dto.UsuarioResponseDTO;
import br.com.recycle.backend.model.Role;
import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
        summary = "Registro de usuário",
        description = "Registra um novo usuário"
    )

    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Usuário registrado com sucesso"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados de registro inválidos ou email já existente"
        ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acesso negado."
            )
    })
    @PreAuthorize("hasRole('GERENTE')")
    @PutMapping("/cadastrar")
    public ResponseEntity cadastrar(
            @Parameter(description = "Dados do novo usuário (nome, email, senha e cnpj)", required = true)
            @Valid @RequestBody RegistroDTO registroDTO) {
        var usuario = authService.registrar(registroDTO);
        authService.atualizarRole(usuario.getId(), Role.OPERADOR);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Modificar um usuário",
            description = "Modificar um usuário"
    )

    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário modificado com sucesso"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados de registro inválidos"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acesso negado."
            )
    })
    @PreAuthorize("hasRole('GERENTE')")
    @PostMapping("/modificar/{email}")
    public ResponseEntity modificar(
            @Parameter(description = "Dados do usuário (nome, email, senha e cnpj)", required = true)
            @PathVariable String email,
            @Valid @RequestBody RegistroDTO registroDTO) {
        try {
            authService.modificar(email, registroDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Deletar um usuário",
            description = "Deletar um usuário"
    )

    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário deletado com sucesso"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados de registro inválidos"
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acesso negado."
            )
    })
    @PreAuthorize("hasRole('GERENTE')")
    @DeleteMapping("/deletar/{email}")
    public ResponseEntity deletar(
            @Parameter(description = "Dados do usuário (nome, email, senha e cnpj)", required = true)
            @PathVariable String email) {
        try {
            authService.deletar(email);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
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
