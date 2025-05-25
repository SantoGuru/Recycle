package br.com.recycle.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class EntradaRequestDTO {

    @NotNull(message = "É necessário selecionar um material")
    private Long materialId;

    @NotNull(message = "A quantidade é obrigatória")
    @Positive(message = "A quantidade deve ser maior que zero")
    private Float quantidade;

    @NotNull(message = "O preço é obrigatório.")
    @DecimalMin(
        value = "0.01",
        inclusive = true,
        message = "O preço deve ser no mínimo R$ 0,01."
    )
    private Float preco;

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

    public Float getPreco() {
        return preco;
    }

    public void setPreco(Float preco) {
        this.preco = preco;
    }
}
