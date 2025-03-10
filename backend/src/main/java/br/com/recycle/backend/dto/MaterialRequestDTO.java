package br.com.recycle.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MaterialRequestDTO {

    @NotBlank(message = "O nome do material é obrigatório")
    @Size(min = 3, max = 50, message = "O nome do material deve ter entre 3 e 50 caracteres")
    private String nome;

    @Size(max = 200, message = "A descrição não pode ter mais de 200 caracteres")
    private String descricao;

    @NotBlank(message = "A unidade de medida é obrigatória")
    private String unidade;

}
