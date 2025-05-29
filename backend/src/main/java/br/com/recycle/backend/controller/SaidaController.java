package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.EntradaRequestDTO;
import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.dto.SaidaRequestDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.service.SaidaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name= "Saídas", description = "Gerencia o registro e listagem de saídas de materiais do estoque")
@RestController
@RequestMapping("/api/saidas")
public class SaidaController {

    private final SaidaService saidaService;

    public SaidaController(SaidaService saidaService) {
        this.saidaService = saidaService;
    }

     @Operation(
        summary = "Registrar saída(s) de material",
        description = "Registra uma ou mais saídas de materiais para o usuário autenticado"
    )

 @PostMapping
    public ResponseEntity<List<SaidaResponseDTO>> registrarSaida(
            @Parameter(description = "Lista das saídas a serem registradas", required = true)
            @Valid @RequestBody List<SaidaRequestDTO> saidas,
            @Parameter(hidden = true) @AuthenticationPrincipal Long usuarioId){
        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<SaidaResponseDTO> resultados = saidaService.registrarSaidas(saidas, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultados);
    }
  
    @Operation(
        summary = "Listar saídas",
        description = "Retorna todas as saídas registradas pelo usuário"
    )

    @GetMapping
    public ResponseEntity<List<SaidaResponseDTO>> listarSaidas(
        @Parameter(hidden = true) @AuthenticationPrincipal Long usuarioId){
        if (usuarioId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<SaidaResponseDTO> saidas = saidaService.listarSaidas(usuarioId);
        if (saidas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(saidas);
    }
}
