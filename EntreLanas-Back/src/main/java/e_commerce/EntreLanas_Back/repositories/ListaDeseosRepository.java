package e_commerce.EntreLanas_Back.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import e_commerce.EntreLanas_Back.model.ListaDeseos;

@Repository
public interface ListaDeseosRepository extends JpaRepository<ListaDeseos, Long> {

    @Query("SELECT l FROM ListaDeseos l WHERE l.usuario.usuario_id = :usuarioId")
    List<ListaDeseos> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT l FROM ListaDeseos l WHERE l.usuario.usuario_id = :usuarioId AND l.producto.producto_id = :productoId")
    Optional<ListaDeseos> findByUsuarioIdAndProductoId(@Param("usuarioId") Long usuarioId,
                                                        @Param("productoId") Long productoId);

    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM ListaDeseos l WHERE l.usuario.usuario_id = :usuarioId AND l.producto.producto_id = :productoId")
    boolean existsByUsuarioIdAndProductoId(@Param("usuarioId") Long usuarioId,
                                            @Param("productoId") Long productoId);
}