package br.com.recycle.backend.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import br.com.recycle.backend.dto.FuncionarioComMovimentacoesDTO;
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

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável por GERENCIAR FUNCIONÁRIOS (usuários do tipo OPERADOR).
 *
 * Regras importantes:
 * - Apenas GERENTE pode criar ou visualizar seus operadores.
 * - Funcionários são sempre vinculados à EMPRESA do gerente autenticado.
 * - Endpoints exigem autenticação JWT.
 */
@Tag(name = "Funcionários", description = "Cadastro de funcionário (OPERADOR) pelo GERENTE")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/usuarios/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    /**
     * Criar novo funcionário (OPERADOR) vinculado ao GERENTE autenticado.
     */
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
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "401", description = "Não autorizado"),
        @ApiResponse(responseCode = "403", description = "Proibido (apenas GERENTE)")
    })
    @PreAuthorize("hasRole('GERENTE')")
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criarFuncionario(
            @Parameter(description = "Dados do funcionário a ser criado", required = true)
            @Valid @RequestBody FuncionarioDTO dto,
            HttpServletRequest request) {

        // Obtém ID do usuário autenticado (GERENTE)
        Long gerenteId = (Long) request.getAttribute("usuarioId");
        if (gerenteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Cria o novo operador associado à empresa do gerente
        Usuario criado = funcionarioService.criarFuncionario(gerenteId, dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UsuarioResponseDTO.fromEntity(criado));
    }

    /**
     * Retorna todos os funcionários (OPERADORES) pertencentes ao gerente autenticado.
     */
    @PreAuthorize("hasRole('GERENTE')")
    @GetMapping
    public ResponseEntity<List<FuncionarioComMovimentacoesDTO>> buscarFuncionarios(HttpServletRequest request) {

        Long gerenteId = (Long) request.getAttribute("usuarioId");
        if (gerenteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Retorna os funcionários + total de movimentações de cada um
        List<FuncionarioComMovimentacoesDTO> funcionarios =
                funcionarioService.buscarFuncionarios(gerenteId);

        return ResponseEntity.ok(funcionarios);
    }

    /**
     * Retorna funcionários do gerente de forma paginada.
     * Útil para tabelas grandes no frontend.
     */
    @PreAuthorize("hasRole('GERENTE')")
    @GetMapping("/paged")
    public ResponseEntity<Page<FuncionarioComMovimentacoesDTO>> buscarFuncionariosPaginado(
            HttpServletRequest request,
            @ParameterObject @PageableDefault(size = 20) Pageable pageable) {

        Long gerenteId = (Long) request.getAttribute("usuarioId");

        Page<FuncionarioComMovimentacoesDTO> page =
                funcionarioService.buscarFuncionariosPaginado(gerenteId, pageable);

        return ResponseEntity.ok(page);
    }
}
