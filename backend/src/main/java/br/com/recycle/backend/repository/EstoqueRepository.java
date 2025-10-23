package br.com.recycle.backend.repository;

import br.com.recycle.backend.model.Empresa;
import br.com.recycle.backend.model.Estoque;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long> {
    List<Estoque> findAllByMaterial_UsuarioId(Long usuarioId);
    List<Estoque> findAllByMaterial_Usuario_Empresa(Empresa empresa);
    Optional<Estoque> findByMaterialIdAndMaterial_UsuarioId(Long materialId, Long usuarioId);

    // >>> NOVO: paginado
    Page<Estoque> findAllByMaterial_UsuarioId(Long usuarioId, Pageable pageable);
}
