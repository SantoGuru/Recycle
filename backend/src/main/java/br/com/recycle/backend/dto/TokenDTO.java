package br.com.recycle.backend.dto;

public class TokenDTO {

    private String token;
    private String tipo;
    private String nome;
    private Long id;
    private String role;
    private Long empresaId;
    private String empresaNome;

    public TokenDTO() {}

    // Construtor padrão usado no AuthService
    public TokenDTO(String token, String nome, Long id, String role, Long empresaId, String empresaNome) {
        this.token = token;
        this.tipo = "Bearer";
        this.nome = nome;
        this.id = id;
        this.role = role;
        this.empresaId = empresaId;
        this.empresaNome = empresaNome;
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

    public String getRole() {
        return role;
    }

    public Long getEmpresaId() {
        return empresaId;
    }

    public String getEmpresaNome() {
        return empresaNome;
    }
}