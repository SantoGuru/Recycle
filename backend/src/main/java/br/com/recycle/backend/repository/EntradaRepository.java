package br.com.recycle.backend.repository;

import br.com.recycle.backend.model.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Long> {
    List<Entrada> findByMaterialId(Long materialId);
    List<Entrada> findByUsuarioId(Long usuarioId);
    List<Entrada> findByUsuarioIdAndDataBetween(Long usuarioId, java.time.LocalDateTime dataInicio, java.time.LocalDateTime dataFim);
}
