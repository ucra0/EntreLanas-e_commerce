package e_commerce.EntreLanas_Back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <--- IMPORTANTE
import org.springframework.data.repository.query.Param; // <--- IMPORTANTE
import org.springframework.stereotype.Repository;

import e_commerce.EntreLanas_Back.model.Usuario;
import e_commerce.EntreLanas_Back.model.vo.Email;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // SOLUCIÓN: Escribimos la consulta manual (JPQL) para que no falle nunca.
    // Buscamos por 'u.username' que es tu variable real.
    
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.username = :username")
    boolean existsByUsername(@Param("username") String username);

    @Query("SELECT u FROM Usuario u WHERE u.username = :username")
    Optional<Usuario> findByUsername(@Param("username") String username);
    
    // Este lo dejamos igual porque 'email' es complejo (Embedded)
    Optional<Usuario> findByEmail(Email email);
}