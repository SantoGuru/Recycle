package br.com.recycle.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import br.com.recycle.backend.dto.EntradaResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public EstoqueResponseDTO registrarEntrada(EntradaRequestDTO entradaRequestDTO, Long usuarioId) {
        validarDadosEntrada(entradaRequestDTO);

        Material material = materialRepository.findById(entradaRequestDTO.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Material não encontrado com ID: " + entradaRequestDTO.getMaterialId()));

        if (!material.getUsuarioId().equals(usuarioId)) {
            throw new RuntimeException("Material não pertence ao usuário");
        }

        Estoque estoque = estoqueRepository.findByMaterialIdAndMaterial_UsuarioId(material.getId(), usuarioId)
                .orElse(null);

        if (estoque == null) {
            estoque = new Estoque();
            estoque.setMaterial(material);
            estoque.setQuantidade(0.0f);
            estoque.setPrecoMedio(0.0f);
            estoque.setValorTotal(0.0f);
            estoque = estoqueRepository.save(estoque); // Salvar antes de prosseguir
        }

        Float quantidadeAtual = estoque.getQuantidade();
        Float precoMedioAtual = estoque.getPrecoMedio();
        Float quantidadeEntrada = entradaRequestDTO.getQuantidade();
        Float precoEntrada = entradaRequestDTO.getPreco();

        Float valorEstoqueAtual = quantidadeAtual * precoMedioAtual;
        Float valorNovaEntrada = quantidadeEntrada * precoEntrada;
        Float quantidadeTotal = quantidadeAtual + quantidadeEntrada;
        Float novoPrecoMedio = quantidadeTotal > 0 ? (valorEstoqueAtual + valorNovaEntrada) / quantidadeTotal : precoEntrada;

        estoque.setQuantidade(quantidadeTotal);
        estoque.setPrecoMedio(novoPrecoMedio);
        estoque.setValorTotal(quantidadeTotal * novoPrecoMedio);
        estoqueRepository.save(estoque);

        Entrada entrada = new Entrada();
        entrada.setMaterial(material);
        entrada.setQuantidade(quantidadeEntrada);
        entrada.setPreco(precoEntrada);
        entrada.setUsuarioId(usuarioId);
        entrada = entradaRepository.save(entrada);

        return EstoqueResponseDTO.fromEntity(estoque);
    }

    @Transactional
    public List<EstoqueResponseDTO> registrarEntradas(List<EntradaRequestDTO> entradas, Long usuarioId) {
        // Valida todas as entradas antes de processar
        for (EntradaRequestDTO entrada : entradas) {
            validarDadosEntrada(entrada);

            Material material = materialRepository.findById(entrada.getMaterialId())
                    .orElseThrow(() -> new RuntimeException("Material não encontrado com ID: " + entrada.getMaterialId()));

            if (!material.getUsuarioId().equals(usuarioId)) {
                throw new RuntimeException("Material não pertence ao usuário");
            }
        }

        // Processa todas as entradas
        List<EstoqueResponseDTO> resultados = new ArrayList<>();
        for (EntradaRequestDTO entrada : entradas) {
            EstoqueResponseDTO resultado = registrarEntrada(entrada, usuarioId);
            resultados.add(resultado);
        }

        return resultados;
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

    @Transactional(readOnly = true)
    public List<EntradaResponseDTO> listarEntradas(Long usuarioId) {
        List<Material> materiais = materialRepository.findAllByUsuarioId(usuarioId);
        List<Long> materiaisIds = materiais.stream().map(Material::getId).collect(Collectors.toList());

        List<Entrada> todasEntradas = new ArrayList<>();
        for (Long materialId : materiaisIds) {
            List<Entrada> entradasDoMaterial = entradaRepository.findByMaterialId(materialId);
            todasEntradas.addAll(entradasDoMaterial);
        }

        return todasEntradas.stream()
                .map(EntradaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}