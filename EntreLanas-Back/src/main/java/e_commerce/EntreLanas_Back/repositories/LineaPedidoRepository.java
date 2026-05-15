package e_commerce.EntreLanas_Back.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import e_commerce.EntreLanas_Back.model.LineaPedido;

@Repository
public interface LineaPedidoRepository extends JpaRepository<LineaPedido, Long> {

    @Query("SELECT l FROM LineaPedido l WHERE l.pedido.pedido_id = :pedidoId")
    List<LineaPedido> findByPedidoId(@Param("pedidoId") Long pedidoId);
}