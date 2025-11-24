package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.DashboardDTO;
import br.com.recycle.backend.service.EstoqueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Controller responsável por fornecer informações gerais (dashboard)
 * com base nos dados de estoque e demais métricas da empresa.
 * 
 * Este endpoint exige autenticação JWT e pode ser acessado por
 * usuários com papel GERENTE ou OPERADOR.
 */
@Tag(name = "Dashboard", description = "Fornece um resumo geral do sistema para o usuário autenticado")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    // Serviço que contém a lógica de cálculo do resumo do dashboard
    private final EstoqueService estoqueService;

    // Injeta o serviço via construtor
    public DashboardController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }

    /**
     * Endpoint para retornar o resumo geral do dashboard.
     * Inclui:
     * - Total de materiais cadastrados
     * - Quantidade total em KG
     * - Valor total do estoque
     * - Lista de materiais com estoque baixo
     *
     * O ID do usuário é extraído do request (inserido previamente pelo filtro JWT).
     */
    @Operation(
        summary = "Resumo geral do dashboard",
        description = "Requer autenticação (Bearer). Permissões: GERENTE e OPERADOR. " +
                      "Retorna total de materiais, quantidade total (KG), valor total do estoque e materiais com estoque baixo."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Resumo retornado com sucesso",
            content = @Content(schema = @Schema(implementation = DashboardDTO.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Não autorizado - token ausente ou inválido",
            content = @Content
        )
    })
    @PreAuthorize("hasAnyRole('GERENTE','OPERADOR')")
    @GetMapping("/resumo")
    public ResponseEntity<DashboardDTO> getResumoDashboard(
        @Parameter(hidden = true) HttpServletRequest request) {

        // O filtro JWT adiciona o userId nos atributos da requisição
        Long usuarioId = (Long) request.getAttribute("usuarioId");

        // Se não houver ID, o token provavelmente é inválido ou ausente
        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Gera o resumo do dashboard para a empresa vinculada ao usuário
        DashboardDTO resumo = estoqueService.gerarResumoDashboard(usuarioId);

        // Retorna as informações consolidadas
        return ResponseEntity.ok(resumo);
    }
}
