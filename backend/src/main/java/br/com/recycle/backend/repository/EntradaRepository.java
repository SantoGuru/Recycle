package br.com.recycle.backend.repository;

import br.com.recycle.backend.model.Entrada;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Long> {
    List<Entrada> findByMaterialId(Long materialId);

    // >>> NOVOS: listar e contar por usuário
    Page<Entrada> findByUsuarioId(Long usuarioId, Pageable pageable);
    long countByUsuarioId(Long usuarioId);
}
