package br.com.recycle.backend.service;

import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Usuario usuario = usuarioRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com email: " + username));

    return new User(
            usuario.getEmail(), usuario.getSenha(), java.util.List.of(
                new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + usuario.getRole().name())
            )
    );
}
}