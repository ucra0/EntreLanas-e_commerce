package e_commerce.EntreLanas_Back.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import e_commerce.EntreLanas_Back.model.Enums.EstadoPedido;

public class PedidoDetalleDTO {

    private Long pedido_id;
    private Long usuario_id;
    private LocalDateTime fechaPedido;
    private BigDecimal precioTotal;
    private String moneda;
    private EstadoPedido estado;
    private List<LineaPedidoDTO> lineas;


    public PedidoDetalleDTO() {
    }

    public PedidoDetalleDTO(Long pedido_id, Long usuario_id, LocalDateTime fechaPedido,
                            BigDecimal precioTotal, String moneda, EstadoPedido estado,
                            List<LineaPedidoDTO> lineas) {
        this.pedido_id = pedido_id;
        this.usuario_id = usuario_id;
        this.fechaPedido = fechaPedido;
        this.precioTotal = precioTotal;
        this.moneda = moneda;
        this.estado = estado;
        this.lineas = lineas;
    }


    public Long getPedido_id() {
        return pedido_id;
    }

    public void setPedido_id(Long pedido_id) {
        this.pedido_id = pedido_id;
    }

    public Long getUsuario_id() {
        return usuario_id;
    }

    public void setUsuario_id(Long usuario_id) {
        this.usuario_id = usuario_id;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public BigDecimal getPrecioTotal() {
        return precioTotal;
    }

    public void setPrecioTotal(BigDecimal precioTotal) {
        this.precioTotal = precioTotal;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public List<LineaPedidoDTO> getLineas() {
        return lineas;
    }

    public void setLineas(List<LineaPedidoDTO> lineas) {
        this.lineas = lineas;
    }
}