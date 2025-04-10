package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EntradaRequestDTO;
import br.com.recycle.backend.dto.EntradaResponseDTO;
import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.model.Entrada;
import br.com.recycle.backend.service.EntradaService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entradas")
public class EntradaController {

    private final EntradaService entradaService;

    @Autowired
    public EntradaController(EntradaService entradaService) {
        this.entradaService = entradaService;
    }

    @PostMapping
    public ResponseEntity<?> registrarEntrada(
            @RequestBody @Validated EntradaRequestDTO entradaDTO,
            HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");

        EstoqueResponseDTO resultado = entradaService.registrarEntrada(entradaDTO, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
    }

    @GetMapping
    public ResponseEntity<List<Entrada>> listarEntradas() {
        List<Entrada> entradas = entradaService.listarEntradas();
        return ResponseEntity.ok(entradas);
    }
}
