package br.com.recycle.backend.repository;

import br.com.recycle.backend.model.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> findByNome(String nome);
    boolean existsByNome(String nome);

    Optional<Material> findByIdAndUsuarioId(Long id, Long usuarioId);

    // >>> ALTERAÇÃO: agora paginado
    Page<Material> findAllByUsuarioId(Long usuarioId, Pageable pageable);

    // (opcional: mantem o antigo se alguma parte ainda usa)
    List<Material> findAllByUsuarioId(Long usuarioId);

    boolean existsByNomeAndUsuarioId(String nome, Long usuarioId);
    boolean existsByIdAndUsuarioId(Long id, Long usuarioId);
}
