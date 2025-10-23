package br.com.recycle.backend.repository;

import br.com.recycle.backend.model.Empresa;
import br.com.recycle.backend.model.Role;
import br.com.recycle.backend.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    //paginar funcionários por empresa + role
    Page<Usuario> findByEmpresaAndRole(Empresa empresa, Role role, Pageable pageable);
}
