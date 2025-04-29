package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EntradaRequestDTO;
import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.model.Entrada;
import br.com.recycle.backend.service.EntradaService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @RequestBody Object requestBody,
            HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");

        if (requestBody instanceof List) {
            @SuppressWarnings("unchecked")
            List<EntradaRequestDTO> entradas = (List<EntradaRequestDTO>) requestBody;
            List<EstoqueResponseDTO> resultados = entradaService.registrarEntradas(entradas, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(resultados);
        } else if (requestBody instanceof EntradaRequestDTO) {
            EntradaRequestDTO entrada = (EntradaRequestDTO) requestBody;
            EstoqueResponseDTO resultado = entradaService.registrarEntrada(entrada, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
        } else {
            throw new IllegalArgumentException("Formato de requisição inválido");
        }
    }

    @GetMapping
    public ResponseEntity<List<Entrada>> listarEntradas() {
        List<Entrada> entradas = entradaService.listarEntradas();
        return ResponseEntity.ok(entradas);
    }
}