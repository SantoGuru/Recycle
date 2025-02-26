package br.com.recycle.backend.dto;

public class TokenDTO {

    private String token;
    private String tipo;
    private String nome;
    private Long id;

    public TokenDTO(String token, String nome, Long id) {
        this.token = token;
        this.tipo = "Bearer";
        this.nome = nome;
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public String getTipo() {
        return tipo;
    }

    public String getNome() {
        return nome;
    }

    public Long getId() {
        return id;
    }

}