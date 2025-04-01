package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EntradaRequestDTO;
import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.model.Entrada;
import br.com.recycle.backend.service.EntradaService;
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
            @RequestParam Long usuarioId) {
        try {
            // Validação adicional dos dados, se necessário
            if (entradaDTO == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Dados da entrada não podem ser nulos");
            }
            
            EstoqueResponseDTO resultado = entradaService.registrarEntrada(entradaDTO, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao registrar entrada: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Entrada>> listarEntradas() {
        try {
            List<Entrada> entradas = entradaService.listarEntradas();
            return ResponseEntity.ok(entradas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
