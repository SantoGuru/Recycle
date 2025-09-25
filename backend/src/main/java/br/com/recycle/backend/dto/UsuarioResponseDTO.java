package br.com.recycle.backend.dto;

import br.com.recycle.backend.model.Role;
import br.com.recycle.backend.model.Usuario;

public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private Role role;

    public UsuarioResponseDTO() {}

    public UsuarioResponseDTO(Long id, String nome, String email, Role role) {
        this.id = id; this.nome = nome; this.email = email; this.role = role;
    }

    public static UsuarioResponseDTO fromEntity(Usuario u){
        return new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getRole());
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }

    public void setId(Long id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(Role role) { this.role = role; }
}
