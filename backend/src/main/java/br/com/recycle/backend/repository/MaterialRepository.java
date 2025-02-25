package br.com.recycle.backend.repository;

import br.com.recycle.backend.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> findByNome(String nome);
    boolean existsByNome(String nome);
}
