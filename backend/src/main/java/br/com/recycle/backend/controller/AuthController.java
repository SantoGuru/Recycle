package br.com.recycle.backend.controller;
import br.com.recycle.backend.dto.LoginDTO;
import br.com.recycle.backend.dto.RegistroDTO;
import br.com.recycle.backend.dto.TokenDTO;
import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;


@Tag(name = "Authentication", description = "Endpoints para autenticação e registro de usuários")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(
        summary = "Login de usuário",
        description = "Realiza a autenticação do usuário e retorna o token JWT"
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
        TokenDTO tokenDTO = authService.login(loginDTO);
        return ResponseEntity.ok(tokenDTO);
    }

    @Operation(
        summary = "Registro de usuário",
        description = "Registra um novo usuário e realiza o login, retornando o token JWT"
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
        Usuario usuario = authService.registrar(registroDTO);

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(registroDTO.getEmail());
        loginDTO.setSenha(registroDTO.getSenha());

        TokenDTO tokenDTO = authService.login(loginDTO);
        return ResponseEntity.ok(tokenDTO);
    }
}
