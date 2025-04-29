package br.com.recycle.backend.controller;

import br.com.recycle.backend.dto.SaidaRequestDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.service.SaidaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.Collections;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Tag(name= "Saídas", description = "Gerencia o registro e listagem de saídas de materiais do estoque")
@RestController
@RequestMapping("/api/saidas")
public class SaidaController {

    private final SaidaService saidaService;
    private final ObjectMapper objectMapper;

    public SaidaController(SaidaService saidaService,ObjectMapper objectMapper) {
        this.saidaService = saidaService;
        this.objectMapper = objectMapper;
    }

     @Operation(
        summary = "Registrar saída(s) de material",
        description = "Registra uma ou mais saídas de materiais para o usuário autenticado"
    )

 @PostMapping
    public ResponseEntity<List<SaidaResponseDTO>> registrarSaida(
            @RequestBody @Valid JsonNode payload,
            HttpServletRequest request) {

        Long usuarioId = (Long) request.getAttribute("usuarioId");

        List<SaidaRequestDTO> dtos;
        if (payload.isArray()) {
            dtos = objectMapper.convertValue(
                payload,
                new TypeReference<List<SaidaRequestDTO>>() {}
            );
        } else {
            SaidaRequestDTO single =
                objectMapper.convertValue(payload, SaidaRequestDTO.class);
            dtos = Collections.singletonList(single);
        }

        List<SaidaResponseDTO> saidas =
            saidaService.registrarSaidas(dtos, usuarioId);

        return ResponseEntity.ok(saidas);
    }
    
    @Operation(
        summary = "Listar saídas",
        description = "Retorna todas as saídas registradas pelo usuário"
    )

    @GetMapping
    public ResponseEntity<List<SaidaResponseDTO>> listarSaidas(HttpServletRequest request) {
        Long usuarioId = (Long) request.getAttribute("usuarioId");
        List<SaidaResponseDTO> saidas = saidaService.listarSaidas(usuarioId);
        return ResponseEntity.ok(saidas);
    }
}
