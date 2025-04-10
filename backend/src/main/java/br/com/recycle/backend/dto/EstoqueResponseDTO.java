package br.com.recycle.backend.dto;

import java.util.List;

import br.com.recycle.backend.model.Entrada;
import br.com.recycle.backend.model.Estoque;
import br.com.recycle.backend.model.Saida;

public class EstoqueResponseDTO {

    private Long materialId;
    private MaterialResponseDTO material;
    private Float quantidade;
    private Float precoMedio;
    private Float valorTotal;
    private List<Entrada> entradas;
    private List<Saida> saidas;

    public static EstoqueResponseDTO fromEntity(Estoque estoque) {
        EstoqueResponseDTO dto = new EstoqueResponseDTO();

        dto.setMaterialId(estoque.getMaterialId());
        dto.setMaterial(MaterialResponseDTO.fromEntity(estoque.getMaterial()));
        dto.setQuantidade(estoque.getQuantidade());
        dto.setPrecoMedio(estoque.getPrecoMedio());
        dto.setValorTotal(estoque.getValorTotal());
        dto.setEntradas(estoque.getEntradas());
        dto.setSaidas(estoque.getSaidas());

        return dto;
    }

    public Long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public MaterialResponseDTO getMaterial() {
        return material;
    }

    public void setMaterial(MaterialResponseDTO material) {
        this.material = material;
    }

    public Float getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Float quantidade) {
        this.quantidade = quantidade;
    }

    public Float getPrecoMedio() {
        return precoMedio;
    }

    public void setPrecoMedio(Float precoMedio) {
        this.precoMedio = precoMedio;
    }

    public Float getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Float valorTotal) {
        this.valorTotal = valorTotal;
    }

    public List<Entrada> getEntradas() {
        return entradas;
    }

    public void setEntradas(List<Entrada> entradas) {
        this.entradas = entradas;
    }

    public List<Saida> getSaidas() {
        return saidas;
    }

    public void setSaidas(List<Saida> saidas) {
        this.saidas = saidas;
    }
}