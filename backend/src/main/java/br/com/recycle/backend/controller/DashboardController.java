package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.DashboardDTO;
import br.com.recycle.backend.service.EstoqueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@Tag(name = "Dashboard", description = "Fornece um resumo geral sobre o sistema para o Usuário")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EstoqueService estoqueService;

    @Autowired
    public DashboardController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }

     @Operation(
        summary = "Resumo geral do dashboard",
        description = "Retorna estatísticas como totais de entradas, saídas e valor de estoque"
     )

    @GetMapping("/resumo")
    public ResponseEntity<DashboardDTO> getResumoDashboard(HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        DashboardDTO resumo = estoqueService.gerarResumoDashboard(usuarioId);
        return ResponseEntity.ok(resumo);
    }
}
