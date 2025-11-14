package br.com.recycle.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
//
import br.com.recycle.backend.dto.EntradaResponseDTO;
import br.com.recycle.backend.dto.FuncionarioDTO;
import br.com.recycle.backend.dto.FuncionarioComMovimentacoesDTO;
import br.com.recycle.backend.dto.SaidaResponseDTO;
import br.com.recycle.backend.dto.UsuarioResponseDTO;
import br.com.recycle.backend.model.Empresa;
import br.com.recycle.backend.model.Role;
import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.repository.UsuarioRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FuncionarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final FuncionarioMovimentacaoService movimentacaoService;

    public FuncionarioService(UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder, FuncionarioMovimentacaoService movimentacaoService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.movimentacaoService = movimentacaoService;
    }

    public Empresa getEmpresaUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .map(usuario -> usuario.getEmpresa())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Transactional
    public Usuario criarFuncionario(Long gerenteId, FuncionarioDTO dto) {
        Empresa empresa = getEmpresaUsuario(gerenteId);

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Usuario func = new Usuario();
        func.setNome(dto.getNome());
        func.setEmail(dto.getEmail());
        func.setSenha(passwordEncoder.encode(dto.getSenha()));
        func.setRole(Role.OPERADOR);
        func.setEmpresa(empresa);

        return usuarioRepository.save(func);
    }

    @Transactional(readOnly = true)
    public List<FuncionarioComMovimentacoesDTO> buscarFuncionarios(Long gerenteId) {
        Usuario gerente = usuarioRepository.findById(gerenteId)
                .orElseThrow(() -> new RuntimeException("Gerente não encontrado"));

        Empresa empresa = gerente.getEmpresa();
        List<Usuario> funcionarios = empresa.getUsuarios().stream()
                .filter(usuario -> usuario.getRole() == Role.OPERADOR)
                .collect(Collectors.toList());

        List<FuncionarioComMovimentacoesDTO> resultado = new ArrayList<>();

        for (Usuario funcionario : funcionarios) {
            List<EntradaResponseDTO> entradas = movimentacaoService.listarEntradas(funcionario.getId());
            List<SaidaResponseDTO> saidas = movimentacaoService.listarSaidas(funcionario.getId());

            FuncionarioComMovimentacoesDTO dto = new FuncionarioComMovimentacoesDTO();
            dto.setFuncionario(UsuarioResponseDTO.fromEntity(funcionario));
            dto.setEntradas(entradas);
            dto.setSaidas(saidas);
            dto.setTotalEntradas(entradas.size());
            dto.setTotalSaidas(saidas.size());

            resultado.add(dto);
        }

        return resultado;
    }

    //
    @Transactional(readOnly = true)
    public Page<FuncionarioComMovimentacoesDTO> buscarFuncionariosPaginado(Long gerenteId, Pageable pageable) {
        Usuario gerente = usuarioRepository.findById(gerenteId)
                .orElseThrow(() -> new RuntimeException("Gerente não encontrado"));

        return usuarioRepository
                .findByEmpresaAndRole(gerente.getEmpresa(), Role.OPERADOR, pageable)
                .map(func -> {
                    var entradas = movimentacaoService.listarEntradas(func.getId());
                    var saidas = movimentacaoService.listarSaidas(func.getId());
                    var dto = new FuncionarioComMovimentacoesDTO();
                    dto.setFuncionario(UsuarioResponseDTO.fromEntity(func));
                    dto.setEntradas(entradas);
                    dto.setSaidas(saidas);
                    dto.setTotalEntradas(entradas.size());
                    dto.setTotalSaidas(saidas.size());
                    return dto;
                });
    }

}
