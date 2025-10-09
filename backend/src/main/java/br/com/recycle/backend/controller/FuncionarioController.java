package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.FuncionarioDTO;
import br.com.recycle.backend.dto.UsuarioResponseDTO;
import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.service.FuncionarioService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Funcionários", description = "Cadastro de funcionário (OPERADOR) pelo GERENTE")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/usuarios/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @Operation(
        summary = "Criar funcionário (OPERADOR)",
        description = "Permite que apenas GERENTE crie funcionário vinculado à sua empresa"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Funcionário criado com sucesso",
            content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos",
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
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criarFuncionario(
        @Parameter(description = "Dados do funcionário a ser criado", required = true)
        @Valid @RequestBody FuncionarioDTO dto,
        HttpServletRequest request) {

        Long gerenteId = (Long) request.getAttribute("usuarioId");
        if (gerenteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario criado = funcionarioService.criarFuncionario(gerenteId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResponseDTO.fromEntity(criado));
    }
}
