package br.com.recycle.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
//
import br.com.recycle.backend.model.Saida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaidaRepository extends JpaRepository<Saida, Long> {
    List<Saida> findByMaterialId(Long materialId);
    List<Saida> findByUsuarioId(Long usuarioId);
    List<Saida> findByUsuarioIdAndDataBetween(Long usuarioId, java.time.LocalDateTime dataInicio, java.time.LocalDateTime dataFim);
//
    Page<Saida> findByUsuarioId(Long usuarioId, Pageable pageable);
    Page<Saida> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDateTime inicio, LocalDateTime fim, Pageable pageable);
}
