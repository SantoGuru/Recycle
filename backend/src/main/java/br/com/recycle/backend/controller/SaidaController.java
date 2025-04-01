package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.SaidaRequestDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.service.SaidaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/saida")
public class SaidaController {

    private final SaidaService saidaService;

    public SaidaController(SaidaService saidaService) {
        this.saidaService = saidaService;
    }

    @PostMapping
    public ResponseEntity<SaidaResponseDTO> registrarSaida(@RequestBody @Valid SaidaRequestDTO saidaRequestDTO,
                                                           @RequestHeader("usuario-id") Long usuarioId) {
        SaidaResponseDTO saida = saidaService.registrarSaida(saidaRequestDTO, usuarioId);
        return ResponseEntity.ok(saida);
    }
}
