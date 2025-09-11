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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Tag(name = "Dashboard", description = "Fornece um resumo geral do sistema para o usuário autenticado")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {


private final EstoqueService estoqueService;


public DashboardController(EstoqueService estoqueService) {
this.estoqueService = estoqueService;
}


@Operation(
summary = "Resumo geral do dashboard",
description = "Retorna estatísticas consolidadas: total de materiais, quantidade total (KG), valor total do estoque e materiais com estoque baixo"
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
@GetMapping("/resumo")
public ResponseEntity<DashboardDTO> getResumoDashboard(
@Parameter(hidden = true) @AuthenticationPrincipal Long usuarioId) {


if (usuarioId == null) {
return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
}


DashboardDTO resumo = estoqueService.gerarResumoDashboard(usuarioId);
return ResponseEntity.ok(resumo);
}
}