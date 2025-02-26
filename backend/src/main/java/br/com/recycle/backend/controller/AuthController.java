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
    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        TokenDTO tokenDTO = authService.login(loginDTO);
        return ResponseEntity.ok(tokenDTO);
    }

    @Operation(
        summary = "Registro de usuário",
        description = "Registra um novo usuário e realiza o login, retornando o token JWT"
    )
    @PostMapping("/registro")
    public ResponseEntity<TokenDTO> registro(@Valid @RequestBody RegistroDTO registroDTO) {
        Usuario usuario = authService.registrar(registroDTO);

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(registroDTO.getEmail());
        loginDTO.setSenha(registroDTO.getSenha());

        TokenDTO tokenDTO = authService.login(loginDTO);
        return ResponseEntity.ok(tokenDTO);
    }
}