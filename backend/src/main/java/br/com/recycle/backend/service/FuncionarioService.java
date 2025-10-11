package br.com.recycle.backend.service;

import br.com.recycle.backend.dto.FuncionarioDTO;
import br.com.recycle.backend.model.Empresa;
import br.com.recycle.backend.model.Role;
import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.repository.UsuarioRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FuncionarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public FuncionarioService(UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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
    public List<Usuario> buscarFuncionarios(Long gerenteId) {
    Usuario gerente = usuarioRepository.findById(gerenteId)
            .orElseThrow(() -> new RuntimeException("Gerente não encontrado"));
    Empresa empresa = gerente.getEmpresa();
    List<Usuario> todosOsUsuariosDaEmpresa = empresa.getUsuarios();
    return todosOsUsuariosDaEmpresa.stream()
            .filter(usuario -> usuario.getRole() == Role.OPERADOR)
            .collect(Collectors.toList());
    }
}
