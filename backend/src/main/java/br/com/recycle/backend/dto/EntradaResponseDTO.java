package br.com.recycle.backend.dto;

import br.com.recycle.backend.model.Entrada;

import java.time.LocalDateTime;

public class EntradaResponseDTO {

    private Long id;
    private Long materialId;
    private String materialNome;
    private Float quantidade;
    private Float preco;
    private Float valorTotal;
    private LocalDateTime data;
    private String usuarioNome;

    public static EntradaResponseDTO fromEntity(Entrada entrada) {
        EntradaResponseDTO dto = new EntradaResponseDTO();
        dto.setId(entrada.getId());
        dto.setMaterialId(entrada.getMaterialId());

        if (entrada.getUsuario() != null) {
            dto.setUsuarioNome(entrada.getUsuario().getNome());
        }

        if (entrada.getMaterial() != null) {
            dto.setMaterialNome(entrada.getMaterial().getNome());
        }

        dto.setQuantidade(entrada.getQuantidade());
        dto.setPreco(entrada.getPreco());
        dto.setValorTotal(entrada.getQuantidade() * entrada.getPreco());
        dto.setData(entrada.getData());

        return dto;
    }

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

    public Float getPreco() {
        return preco;
    }

    public void setPreco(Float preco) {
        this.preco = preco;
    }

    public Float getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Float valorTotal) {
        this.valorTotal = valorTotal;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }
}
