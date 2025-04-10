package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.SaidaRequestDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.service.SaidaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saidas")
public class SaidaController {

    private final SaidaService saidaService;

    public SaidaController(SaidaService saidaService) {
        this.saidaService = saidaService;
    }

    @PostMapping
    public ResponseEntity<SaidaResponseDTO> registrarSaida(@RequestBody @Valid SaidaRequestDTO saidaRequestDTO,
    HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId"); 
        SaidaResponseDTO saida = saidaService.registrarSaida(saidaRequestDTO, usuarioId);
        return ResponseEntity.ok(saida);
    }
}
