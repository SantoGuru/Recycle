package br.com.recycle.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "estoque")
public class Estoque {

    @Id
    private Long materialId;

    @OneToOne
    @JoinColumn(name = "material_id")
    @MapsId
    private Material material;

    @Column(nullable = false)
    private Float quantidade;

    @Column(name = "preco_medio", nullable = false)
    private Float precoMedio;

    @Column(name = "valor_total", nullable = false)
    private Float valorTotal;

    @OneToMany(mappedBy = "estoque")
    private List<Entrada> entradas;

    @OneToMany(mappedBy = "estoque")
    private List<Saida> saidas;
}
