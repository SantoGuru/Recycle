package br.com.recycle.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.recycle.backend.dto.EntradaRequestDTO;
import br.com.recycle.backend.dto.EstoqueResponseDTO;
import br.com.recycle.backend.dto.MaterialResponseDTO;

import br.com.recycle.backend.model.Entrada;
import br.com.recycle.backend.model.Estoque;
import br.com.recycle.backend.model.Material;
import br.com.recycle.backend.repository.EntradaRepository;
import br.com.recycle.backend.repository.EstoqueRepository;
import br.com.recycle.backend.repository.MaterialRepository;

@Service
public class EntradaService {

    private final EntradaRepository entradaRepository;
    private final EstoqueRepository estoqueRepository;
    private final MaterialRepository materialRepository;

    @Autowired
    public EntradaService(
            EntradaRepository entradaRepository,
            EstoqueRepository estoqueRepository,
            MaterialRepository materialRepository) {
        this.entradaRepository = entradaRepository;
        this.estoqueRepository = estoqueRepository;
        this.materialRepository = materialRepository;
    }


    public EstoqueResponseDTO registrarEntrada(EntradaRequestDTO entradaRequestDTO, Long usuarioId) {
        validarDadosEntrada(entradaRequestDTO);

        Material material = materialRepository.findById(entradaRequestDTO.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Material não encontrado com ID: " + entradaRequestDTO.getMaterialId()));

        Estoque estoque = buscarOuCriarEstoque(material, usuarioId);

        Float novoPrecoMedio = calcularPrecoMedio(
                estoque.getQuantidade(), 
                estoque.getPrecoMedio(), 
                entradaRequestDTO.getQuantidade(), 
                entradaRequestDTO.getPreco()
        );

        estoque.setQuantidade(estoque.getQuantidade() + entradaRequestDTO.getQuantidade());
        estoque.setPrecoMedio(novoPrecoMedio);
        estoque.setValorTotal(calcularValorTotal(estoque.getQuantidade(), novoPrecoMedio));

        estoqueRepository.save(estoque);

        Entrada entrada = new Entrada();
        entrada.setMaterial(material);
        entrada.setQuantidade(entradaRequestDTO.getQuantidade());
        entrada.setPreco(entradaRequestDTO.getPreco());
        entrada.setData(LocalDateTime.now());
        entrada.setEstoque(estoque);
        
        entradaRepository.save(entrada);

        return mapToEstoqueDTO(estoque);
    }

    private void validarDadosEntrada(EntradaRequestDTO entradaDTO) {
        if (entradaDTO == null) {
            throw new RuntimeException("Dados de entrada não podem ser nulos");
        }
        
        if (entradaDTO.getMaterialId() == null) {
            throw new RuntimeException("ID do material é obrigatório");
        }
        
        if (entradaDTO.getQuantidade() == null || entradaDTO.getQuantidade() <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }
        
        if (entradaDTO.getPreco() == null || entradaDTO.getPreco() < 0) {
            throw new RuntimeException("Preço unitário deve ser um valor positivo");
        }
    }

    private Estoque buscarOuCriarEstoque(Material material, Long usuarioId) {
        Optional<Estoque> estoqueOpt = estoqueRepository.findByMaterialIdAndMaterial_UsuarioId(material.getId(),usuarioId);
        
        if (estoqueOpt.isPresent()) {
            return estoqueOpt.get();
        } else {
            Estoque novoEstoque = new Estoque();
            novoEstoque.setMaterial(material);
            novoEstoque.setQuantidade(Float.valueOf(0));
            novoEstoque.setPrecoMedio(Float.valueOf(0));
            novoEstoque.setValorTotal(Float.valueOf(0));
            return novoEstoque;
        }
    }

    public Float calcularPrecoMedio(
        Float quantidadeAtual, 
        Float precoMedioAtual,
        Float quantidadeEntrada, 
        Float precoEntrada) {
        
        if (quantidadeAtual == null || quantidadeAtual <= 0f) {
            return precoEntrada;
        }
        
        Float valorEstoqueAtual = (quantidadeAtual * precoMedioAtual);
        Float valorNovaEntrada = (quantidadeEntrada * precoEntrada);
        Float valorTotal = valorEstoqueAtual + valorNovaEntrada;
        Float quantidadeTotal = quantidadeAtual + quantidadeEntrada;
        
        if (quantidadeTotal == 0f) {
            return 0f;
        }
        
        return valorTotal/quantidadeTotal;
    }

    public Float calcularValorTotal(Float quantidade, Float precoMedio) {
        return quantidade*precoMedio;
    }

    private EstoqueResponseDTO mapToEstoqueDTO(Estoque estoque) {
        EstoqueResponseDTO dto = new EstoqueResponseDTO();
        dto.setMaterialId(estoque.getMaterialId());
        
        MaterialResponseDTO materialDTO = new MaterialResponseDTO();
        materialDTO.setId(estoque.getMaterial().getId());
        materialDTO.setNome(estoque.getMaterial().getNome());
        materialDTO.setDescricao(estoque.getMaterial().getDescricao());
        materialDTO.setUnidade(estoque.getMaterial().getUnidade());
        Material material = new Material();
        material.setId(estoque.getMaterial().getId());
        dto.setMaterial(MaterialResponseDTO.fromEntity(estoque.getMaterial()));
        dto.setQuantidade(estoque.getQuantidade());
        dto.setPrecoMedio(estoque.getPrecoMedio());
        dto.setValorTotal(estoque.getValorTotal());
        return dto;
    }

    public List<Entrada> listarEntradas() {
        return entradaRepository.findAll();
    }
}
