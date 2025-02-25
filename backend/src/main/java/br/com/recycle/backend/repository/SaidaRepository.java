package br.com.recycle.backend.repository;

import br.com.recycle.backend.model.Saida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaidaRepository extends JpaRepository<Saida, Long> {
    List<Saida> findByMaterialId(Long materialId);
}
