package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.LoginDTO;
import br.com.recycle.backend.dto.RegistroDTO;
import br.com.recycle.backend.dto.TokenDTO;
import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;


/**
 * Controlador responsável pelos endpoints de autenticação e registro de usuários.
 * Este controller é público (@PermitAll), permitindo que novos usuários se registrem
 * e usuários existentes realizem login.
 */
@Tag(name = "Authentication", description = "Endpoints para autenticação e registro de usuários")
@PermitAll
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Serviço responsável pela lógica de autenticação e registro.
    private final AuthService authService;

    // Injeta o AuthService pelo construtor (boas práticas do Spring)
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint de login.
     * Recebe as credenciais do usuário e retorna um token JWT.
     */
    @Operation(
        summary = "Login de usuário",
        description = "Acesso público. Autentica o usuário e retorna um token JWT (Bearer)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Login realizado com sucesso",
            content = @Content(schema = @Schema(implementation = TokenDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Credenciais incorretas",
            content = @Content
        )
    })
    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(
        @Parameter(description = "Credenciais do usuário para login", required = true)
        @Valid @RequestBody LoginDTO loginDTO) {

        // Chama o serviço de autenticação para gerar o token
        TokenDTO tokenDTO = authService.login(loginDTO);

        // Retorna o token com status 200
        return ResponseEntity.ok(tokenDTO);
    }

    /**
     * Endpoint de registro.
     * Cria um novo usuário e a empresa (caso necessário) e, em seguida,
     * realiza o login automático retornando o token JWT.
     */
    @Operation(
        summary = "Registro de usuário",
        description = "Acesso público. Registra um novo usuário (cria a empresa se necessário) e retorna token JWT (Bearer)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Usuário registrado com sucesso",
            content = @Content(schema = @Schema(implementation = TokenDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados de registro inválidos ou email já existente",
            content = @Content
        )
    })
    @PostMapping("/registro")
    public ResponseEntity<TokenDTO> registro(
        @Parameter(description = "Dados do novo usuário (nome, email, senha e cnpj)", required = true)
        @Valid @RequestBody RegistroDTO registroDTO) {

        // Registra o usuário e possivelmente cria uma empresa associada
        Usuario usuario = authService.registrar(registroDTO);

        // Após registrar, realiza login automaticamente
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(registroDTO.getEmail());
        loginDTO.setSenha(registroDTO.getSenha());
        
        // Gera o token para o novo usuário
        TokenDTO tokenDTO = authService.login(loginDTO);

        // Retorna o token com status 200
        return ResponseEntity.ok(tokenDTO);
    }
}
