package e_commerce.EntreLanas_Back.Services;

import java.util.List;

import e_commerce.EntreLanas_Back.dtos.PedidoDetalleDTO;
import e_commerce.EntreLanas_Back.dtos.PedidoResumenDTO;
import e_commerce.EntreLanas_Back.model.Enums.EstadoPedido;

public interface PedidoService {

    // Devuelve todos los pedidos (solo Admin)
    List<PedidoResumenDTO> listarTodos();

    // Devuelve todos los pedidos de un usuario concreto
    List<PedidoResumenDTO> listarPorUsuario(Long usuarioId);

    // Devuelve todos los pedidos filtrados por estado (solo Admin)
    List<PedidoResumenDTO> listarPorEstado(EstadoPedido estado);

    // Devuelve el detalle completo de un pedido con sus líneas
    PedidoDetalleDTO obtenerPorId(Long id);

    // Crea un nuevo pedido a partir del carrito del usuario
    PedidoDetalleDTO crearPedido(PedidoDetalleDTO pedidoDTO);

    // Actualiza el estado de un pedido (solo Admin)
    PedidoResumenDTO actualizarEstado(Long id, EstadoPedido nuevoEstado);

    // Cancela un pedido (usuario o Admin)
    PedidoResumenDTO cancelarPedido(Long id);
}