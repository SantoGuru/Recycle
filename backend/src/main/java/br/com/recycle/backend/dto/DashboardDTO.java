package br.com.recycle.backend.dto;

import java.math.BigDecimal;

public class DashboardDTO {

    private Integer totalMateriais;
    private Float quantidadeTotalKg;
    private Float valorTotalEstoque;
    private Integer materiaisComEstoqueBaixo;

    public DashboardDTO(Integer totalMateriais, Float quantidadeTotalKg,
                        Float valorTotalEstoque, Integer materiaisComEstoqueBaixo) {
        this.totalMateriais = totalMateriais;
        this.quantidadeTotalKg = quantidadeTotalKg;
        this.valorTotalEstoque = valorTotalEstoque;
        this.materiaisComEstoqueBaixo = materiaisComEstoqueBaixo;
    }

    public Integer getTotalMateriais() {
        return totalMateriais;
    }

    public void setTotalMateriais(Integer totalMateriais) {
        this.totalMateriais = totalMateriais;
    }

    public Float getQuantidadeTotalKg() {
        return quantidadeTotalKg;
    }

    public void setQuantidadeTotalKg(Float quantidadeTotalKg) {
        this.quantidadeTotalKg = quantidadeTotalKg;
    }

    public Float getValorTotalEstoque() {
        return valorTotalEstoque;
    }

    public void setValorTotalEstoque(Float valorTotalEstoque) {
        this.valorTotalEstoque = valorTotalEstoque;
    }

    public Integer getMateriaisComEstoqueBaixo() {
        return materiaisComEstoqueBaixo;
    }

    public void setMateriaisComEstoqueBaixo(Integer materiaisComEstoqueBaixo) {
        this.materiaisComEstoqueBaixo = materiaisComEstoqueBaixo;
    }
}