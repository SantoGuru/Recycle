package br.com.recycle.backend.repository;

import br.com.recycle.backend.model.Saida;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaidaRepository extends JpaRepository<Saida, Long> {
    List<Saida> findByMaterialId(Long materialId);
    List<Saida> findByUsuarioId(Long usuarioId);

    // >>> NOVOS: paginado e contagem
    Page<Saida> findByUsuarioId(Long usuarioId, Pageable pageable);
    long countByUsuarioId(Long usuarioId);
}
