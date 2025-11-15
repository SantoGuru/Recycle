package br.com.recycle.backend.dto;

import br.com.recycle.backend.model.Saida;

import java.time.LocalDateTime;

public class SaidaResponseDTO {

    private Long id;
    private Long materialId;
    private String materialNome;
    private Float quantidade;
    private LocalDateTime data;
    private String usuarioNome;

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public void setUsuarioNome(String usuarioNome) {
        this.usuarioNome = usuarioNome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public String getMaterialNome() {
        return materialNome;
    }

    public void setMaterialNome(String materialNome) {
        this.materialNome = materialNome;
    }

    public Float getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Float quantidade) {
        this.quantidade = quantidade;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public static SaidaResponseDTO fromEntity(Saida saida) {
        SaidaResponseDTO dto = new SaidaResponseDTO();
        dto.setId(saida.getId());
        dto.setMaterialId(saida.getMaterialId());

        if (saida.getUsuario() != null) {
            dto.setUsuarioNome(saida.getUsuario().getNome());
        }

        if (saida.getMaterial() != null) {
            dto.setMaterialNome(saida.getMaterial().getNome());
        }

        dto.setQuantidade(saida.getQuantidade());
        dto.setData(saida.getData());

        return dto;
    }
}
