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
import br.com.recycle.backend.security.LoginAttemptService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException; 

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmpresaRepository empresaRepository;
    private final LoginAttemptService loginAttemptService;
    private final HttpServletRequest request;

    public AuthService(
            UsuarioRepository usuarioRepository,
            EmpresaRepository empresaRepository,
            PasswordEncoder passwordEncoder,
            CustomUserDetailsService userDetailsService,
            JwtTokenProvider jwtTokenProvider, 
            LoginAttemptService loginAttemptService, 
            HttpServletRequest request) {
        this.usuarioRepository = usuarioRepository;
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.loginAttemptService = loginAttemptService;
        this.request = request;
    }

    public TokenDTO login(LoginDTO loginDTO) {
        try {
            final String ip = loginAttemptService.getClientIP(request);
            if (loginAttemptService.isBlocked(ip)) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Muitas tentativas de login falhas. Tente novamente mais tarde.");
            }
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getEmail());

            if (!passwordEncoder.matches(loginDTO.getSenha(), userDetails.getPassword())) {
                loginAttemptService.loginFailed(ip); 
                throw new BadCredentialsException("Credenciais inválidas");
            }

            Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));
            String token = jwtTokenProvider.generateToken(userDetails);
            loginAttemptService.loginSucceeded(ip);

            return new TokenDTO(token, usuario.getNome(), usuario.getId(), usuario.getRole().name(),
            usuario.getEmpresa() != null ? usuario.getEmpresa().getId() : null,
            usuario.getEmpresa() != null ? usuario.getEmpresa().getNomeFantasia() : null
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
    }

    @Transactional 
    public Usuario registrar(RegistroDTO registroDTO) {

        if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        if (empresaRepository.existsByCnpj(registroDTO.getCnpj())) {
            throw new RuntimeException("CNPJ já cadastrado");
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

    @PreAuthorize("hasRole('GERENTE')")
    @Transactional
    public Usuario atualizarRole(Long usuarioId, Role novoRole) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setRole(novoRole);
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void modificar(String email, RegistroDTO modificacao) throws Exception {
        if (!usuarioRepository.existsByEmail(email)) {
            throw new Exception("Email não encontrado");
        }

        var user = usuarioRepository.findByEmail(email);
        if (user.isPresent()) {
            var modificado = user.get();
            modificado.setNome(modificacao.getNome());
            modificado.setEmail(modificacao.getEmail());
            modificado.setSenha(modificacao.getSenha());
            usuarioRepository.save(modificado);
        }
    }

    @Transactional
    public void deletar(String email) throws Exception {
        if (!usuarioRepository.existsByEmail(email)) {
            throw new Exception("Email não encontrado");
        }

        var user = usuarioRepository.findByEmail(email);
        if (user.isPresent()) {
            var modificado = user.get();
            usuarioRepository.delete(modificado);
        }
    }
}
