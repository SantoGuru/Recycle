package br.com.recycle.backend.dto;

import br.com.recycle.backend.model.Material;
import lombok.Data;

import java.time.LocalDateTime;

@Data
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
}
