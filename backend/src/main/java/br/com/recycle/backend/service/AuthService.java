package br.com.recycle.backend.service;

import br.com.recycle.backend.dto.LoginDTO;
import br.com.recycle.backend.dto.RegistroDTO;
import br.com.recycle.backend.dto.TokenDTO;
import br.com.recycle.backend.model.Empresa;
import br.com.recycle.backend.model.Role;
import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.repository.EmpresaRepository;
import br.com.recycle.backend.repository.UsuarioRepository;
import br.com.recycle.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmpresaRepository empresaRepository;

    public AuthService(
            UsuarioRepository usuarioRepository,
            EmpresaRepository empresaRepository,
            PasswordEncoder passwordEncoder,
            CustomUserDetailsService userDetailsService,
            JwtTokenProvider jwtTokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public TokenDTO login(LoginDTO loginDTO) {
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getEmail());

            if (!passwordEncoder.matches(loginDTO.getSenha(), userDetails.getPassword())) {
                throw new BadCredentialsException("Senha inválida");
            }

            Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado"));

            String token = jwtTokenProvider.generateToken(userDetails);

            return new TokenDTO(token, usuario.getNome(), usuario.getId());
        } catch (Exception e) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
    }

    @Transactional 
    public Usuario registrar(RegistroDTO registroDTO) {

        if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Empresa empresa = empresaRepository.findByCnpj(registroDTO.getCnpj())
                .orElseGet(() -> {
                    if (registroDTO.getNomeFantasia() == null || registroDTO.getNomeFantasia().isBlank()) {
                        throw new IllegalArgumentException("O nome fantasia é obrigatório para cadastrar uma nova empresa.");
                    }
                    Empresa novaEmpresa = new Empresa();
                    novaEmpresa.setCnpj(registroDTO.getCnpj());
                    novaEmpresa.setNomeFantasia(registroDTO.getNomeFantasia());
                    return empresaRepository.save(novaEmpresa);
                });

        Usuario usuario = new Usuario();
        usuario.setNome(registroDTO.getNome());
        usuario.setEmail(registroDTO.getEmail());
        usuario.setSenha(passwordEncoder.encode(registroDTO.getSenha()));
        usuario.setRole(Role.GERENTE);
        usuario.setEmpresa(empresa);

        return usuarioRepository.save(usuario);
    }
}
