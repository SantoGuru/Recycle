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

/**
 * Controller responsável pelo gerenciamento de usuários, incluindo:
 * - Cadastro realizado por GERENTE
 * - Modificação de dados
 * - Exclusão de usuários
 * - Atualização de papéis (roles)
 *
 * Todos os endpoints exigem autenticação via JWT (bearerAuth)
 * e requerem papel GERENTE.
 */
@Tag(name = "Usuários", description = "Gerenciamento de papéis de usuários")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    // Serviço responsável pela lógica de autenticação e manipulação de usuários
    private final AuthService authService;

    // Injeta AuthService pelo construtor
    public UsuarioController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint para cadastro de um novo usuário.
     * Apenas GERENTE pode cadastrar novos usuários.
     * Por padrão, o usuário é criado como OPERADOR.
     */
    @Operation(
        summary = "Registro de usuário",
        description = "Registra um novo usuário"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário registrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados de registro inválidos ou email já existente"),
        @ApiResponse(responseCode = "403", description = "Acesso negado.")
    })
    @PreAuthorize("hasRole('GERENTE')")
    @PutMapping("/cadastrar")
    public ResponseEntity cadastrar(
            @Parameter(description = "Dados do novo usuário (nome, email, senha e cnpj)", required = true)
            @Valid @RequestBody RegistroDTO registroDTO) {

        // Registra o usuário
        var usuario = authService.registrar(registroDTO);

        // Define o papel padrão como OPERADOR
        authService.atualizarRole(usuario.getId(), Role.OPERADOR);

        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para modificar os dados de um usuário existente.
     * A busca do usuário é feita pelo email informado na URL.
     */
    @Operation(
            summary = "Modificar um usuário",
            description = "Modificar um usuário"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário modificado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de registro inválidos"),
            @ApiResponse(responseCode = "403", description = "Acesso negado.")
    })
    @PreAuthorize("hasRole('GERENTE')")
    @PostMapping("/modificar/{email}")
    public ResponseEntity modificar(
            @Parameter(description = "Email do usuário a ser modificado", required = true)
            @PathVariable String email,
            @Valid @RequestBody RegistroDTO registroDTO) {

        try {
            // Solicita ao serviço a modificação do usuário
            authService.modificar(email, registroDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para deletar um usuário existente.
     * O usuário é identificado pelo email.
     */
    @Operation(
            summary = "Deletar um usuário",
            description = "Deletar um usuário"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário deletado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Acesso negado.")
    })
    @PreAuthorize("hasRole('GERENTE')")
    @DeleteMapping("/deletar/{email}")
    public ResponseEntity deletar(
            @Parameter(description = "Email do usuário a ser deletado", required = true)
            @PathVariable String email) {

        try {
            // Remove o usuário com o email informado
            authService.deletar(email);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para atualizar o papel (ROLE) de um usuário.
     * Apenas GERENTE pode alterar papéis.
     * Retorna os dados do usuário após atualização.
     */
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
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
        @ApiResponse(responseCode = "401", description = "Não autorizado"),
        @ApiResponse(responseCode = "403", description = "Proibido")
    })
    @PreAuthorize("hasRole('GERENTE')")
    @PutMapping("/role")
    public ResponseEntity<UsuarioResponseDTO> atualizarRole(
        @Valid @RequestBody AtualizarRoleDTO dto
    ) {
        // Atualiza o papel do usuário
        Usuario usuario = authService.atualizarRole(dto.getUsuarioId(), dto.getNovoRole());

        // Converte a entidade para DTO antes de retornar
        return ResponseEntity.ok(UsuarioResponseDTO.fromEntity(usuario));
    }
}
