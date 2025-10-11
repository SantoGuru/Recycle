package br.com.recycle.backend.dto;

import java.util.List;

public class FuncionarioComMovimentacoesDTO {
    private UsuarioResponseDTO funcionario;
    private int totalEntradas;
    private int totalSaidas;
    private List<EntradaResponseDTO> entradas;
    private List<SaidaResponseDTO> saidas;

    public UsuarioResponseDTO getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(UsuarioResponseDTO funcionario) {
        this.funcionario = funcionario;
    }

    public int getTotalEntradas() {
        return totalEntradas;
    }

    public void setTotalEntradas(int totalEntradas) {
        this.totalEntradas = totalEntradas;
    }

    public int getTotalSaidas() {
        return totalSaidas;
    }

    public void setTotalSaidas(int totalSaidas) {
        this.totalSaidas = totalSaidas;
    }

    public List<EntradaResponseDTO> getEntradas() {
        return entradas;
    }

    public void setEntradas(List<EntradaResponseDTO> entradas) {
        this.entradas = entradas;
    }

    public List<SaidaResponseDTO> getSaidas() {
        return saidas;
    }

    public void setSaidas(List<SaidaResponseDTO> saidas) {
        this.saidas = saidas;
    }
}
