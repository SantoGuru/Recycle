package br.com.recycle.backend.dto;

import br.com.recycle.backend.model.Material;

import java.time.LocalDateTime;

public class MaterialResponseDTO {

    private Long id;
    private String nome;
    private String descricao;
    private String unidade;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;


    public static MaterialResponseDTO fromEntity(Material material) {
        MaterialResponseDTO dto = new MaterialResponseDTO();

        dto.setId(material.getId());
        dto.setNome(material.getNome());
        dto.setDescricao(material.getDescricao());
        dto.setUnidade(material.getUnidade());
        dto.setDataCriacao(material.getDataCriacao());
        dto.setDataAtualizacao(material.getDataAtualizacao());

        return dto;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

}
