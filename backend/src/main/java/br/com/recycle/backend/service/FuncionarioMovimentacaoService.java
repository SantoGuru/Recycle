package br.com.recycle.backend.service;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.stereotype.Service;

import br.com.recycle.backend.dto.EntradaResponseDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.repository.EntradaRepository;
import br.com.recycle.backend.repository.SaidaRepository;

@Service
public class FuncionarioMovimentacaoService {

    private final EntradaRepository entradaRepository;
    private final SaidaRepository saidaRepository;

    public FuncionarioMovimentacaoService(
            EntradaRepository entradaRepository,
            SaidaRepository saidaRepository) {
        this.entradaRepository = entradaRepository;
        this.saidaRepository = saidaRepository;
    }

    public List<EntradaResponseDTO> listarEntradas(Long funcionarioId) {
        return entradaRepository.findByUsuarioId(funcionarioId)
                .stream()
                .map(EntradaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<SaidaResponseDTO> listarSaidas(Long funcionarioId) {
        return saidaRepository.findByUsuarioId(funcionarioId)
                .stream()
                .map(SaidaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
