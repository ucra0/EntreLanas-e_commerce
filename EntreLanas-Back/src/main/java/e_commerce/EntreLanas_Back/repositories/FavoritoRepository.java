package e_commerce.EntreLanas_Back.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import e_commerce.EntreLanas_Back.model.Favorito;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    @Query("SELECT f FROM Favorito f WHERE f.usuario.usuario_id = :usuarioId")
    List<Favorito> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT f FROM Favorito f WHERE f.usuario.usuario_id = :usuarioId AND f.producto.producto_id = :productoId")
    Optional<Favorito> findByUsuarioIdAndProductoId(@Param("usuarioId") Long usuarioId,
                                                     @Param("productoId") Long productoId);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Favorito f WHERE f.usuario.usuario_id = :usuarioId AND f.producto.producto_id = :productoId")
    boolean existsByUsuarioIdAndProductoId(@Param("usuarioId") Long usuarioId,
                                            @Param("productoId") Long productoId);
}