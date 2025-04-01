package br.com.recycle.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class SaidaRequestDTO {

    @NotNull(message = "É necessário selecionar um material")
    private Long materialId;

    @NotNull(message = "A quantidade é obrigatória")
    @Positive(message = "A quantidade deve ser maior que zero")
    private Float quantidade;

    public Long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public Float getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Float quantidade) {
        this.quantidade = quantidade;
    }
}
