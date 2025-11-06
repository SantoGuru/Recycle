package br.com.recycle.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import br.com.recycle.backend.model.Empresa;
import br.com.recycle.backend.model.Role;
//
import br.com.recycle.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
//
    Page<Usuario> findByEmpresaAndRole(Empresa empresa, Role role, Pageable pageable);
}
