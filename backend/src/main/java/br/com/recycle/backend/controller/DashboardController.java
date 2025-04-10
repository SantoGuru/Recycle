package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.DashboardDTO;
import br.com.recycle.backend.service.EstoqueService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EstoqueService estoqueService;

    @Autowired
    public DashboardController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }

    @GetMapping("/resumo")
    public ResponseEntity<DashboardDTO> getResumoDashboard(HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        DashboardDTO resumo = estoqueService.gerarResumoDashboard(usuarioId);
        return ResponseEntity.ok(resumo);
    }
}