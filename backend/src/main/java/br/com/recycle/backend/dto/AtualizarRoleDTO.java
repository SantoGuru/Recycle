package br.com.recycle.backend.dto;

import br.com.recycle.backend.model.Role;
import jakarta.validation.constraints.NotNull;

public class AtualizarRoleDTO {

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long usuarioId;

    @NotNull(message = "O novo papel é obrigatório")
    private Role novoRole;
    
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Role getNovoRole() { return novoRole; }
    public void setNovoRole(Role novoRole) { this.novoRole = novoRole; }
}