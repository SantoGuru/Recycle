package br.com.recycle.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;        
//
import br.com.recycle.backend.model.Empresa;
import br.com.recycle.backend.model.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long> {
    Optional<Estoque> findByMaterialId(Long materialId);
    List<Estoque> findByMaterialIdIn(Set<Long> materialIds);
    List<Estoque> findAllByMaterial_UsuarioId(Long usuarioId);
    List<Estoque> findAllByMaterial_Usuario_Empresa(Empresa empresa);
    Optional<Estoque> findByMaterialIdAndMaterial_UsuarioId(Long materialId, Long usuarioId);
    List<Estoque> findByMaterialUsuarioIdAndMaterialNomeContainingIgnoreCase(Long usuarioId, String nomeMaterial);
    List<Estoque> findByMaterialIdInAndMaterial_UsuarioId(Set<Long> materialIds, Long usuarioId);
    Page<Estoque> findAllByMaterial_UsuarioId(Long usuarioId, Pageable pageable);
    Page<Estoque> findByMaterialUsuarioIdAndMaterialNomeContainingIgnoreCase(Long usuarioId, String nomeMaterial, Pageable pageable);
}
