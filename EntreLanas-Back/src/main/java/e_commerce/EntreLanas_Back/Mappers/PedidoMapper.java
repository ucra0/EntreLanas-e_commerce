package e_commerce.EntreLanas_Back.Mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import e_commerce.EntreLanas_Back.dtos.LineaPedidoDTO;
import e_commerce.EntreLanas_Back.dtos.PedidoDetalleDTO;
import e_commerce.EntreLanas_Back.dtos.PedidoResumenDTO;
import e_commerce.EntreLanas_Back.model.LineaPedido;
import e_commerce.EntreLanas_Back.model.Pedido;

@Component
public class PedidoMapper {

    public PedidoResumenDTO toResumenDTO(Pedido pedido) {
        if (pedido == null) return null;

        return new PedidoResumenDTO(
            pedido.getPedido_id(),
            pedido.getUsuario().getUsuario_id(),
            pedido.getFechaPedido(),
            pedido.getPrecioTotal().getImporte(),
            pedido.getPrecioTotal().getMoneda(),
            pedido.getEstado()
        );
    }

    public PedidoDetalleDTO toDetalleDTO(Pedido pedido) {
        if (pedido == null) return null;

        List<LineaPedidoDTO> lineasDTO = pedido.getLineas().stream()
                .map(this::toLineaDTO)
                .collect(Collectors.toList());

        return new PedidoDetalleDTO(
            pedido.getPedido_id(),
            pedido.getUsuario().getUsuario_id(),
            pedido.getFechaPedido(),
            pedido.getPrecioTotal().getImporte(),
            pedido.getPrecioTotal().getMoneda(),
            pedido.getEstado(),
            lineasDTO
        );
    }

    public LineaPedidoDTO toLineaDTO(LineaPedido linea) {
        if (linea == null) return null;

        return new LineaPedidoDTO(
            linea.getLinea_id(),
            linea.getProducto().getProducto_id(),
            linea.getProducto().getTitulo(),
            linea.getCantidad(),
            linea.getPrecioUnitario().getImporte(),
            linea.getPrecioUnitario().getMoneda()
        );
    }
}