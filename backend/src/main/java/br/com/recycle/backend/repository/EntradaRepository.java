package br.com.recycle.backend.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

import br.com.recycle.backend.model.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Long> {
    List<Entrada> findByMaterialId(Long materialId);
    List<Entrada> findByUsuarioId(Long usuarioId);
    List<Entrada> findByUsuarioIdAndDataBetween(Long usuarioId, java.time.LocalDateTime dataInicio, java.time.LocalDateTime dataFim);

    Page<Entrada> findByUsuarioId(Long usuarioId, Pageable pageable);
    Page<Entrada> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDateTime inicio, LocalDateTime fim, Pageable pageable);
}
