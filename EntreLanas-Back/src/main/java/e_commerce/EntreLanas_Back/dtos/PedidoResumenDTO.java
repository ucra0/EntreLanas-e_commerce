package e_commerce.EntreLanas_Back.dtos;

import java.time.LocalDateTime;

import e_commerce.EntreLanas_Back.model.Enums.EstadoPedido;

public class PedidoResumenDTO {

    private Long pedido_id;
    private Long usuario_id;
    private LocalDateTime fechaPedido;
    private Double precioTotal;
    private EstadoPedido estado;


    public PedidoResumenDTO() {
    }

    public PedidoResumenDTO(Long pedido_id, Long usuario_id, LocalDateTime fechaPedido,
                            Double precioTotal, EstadoPedido estado) {
        this.pedido_id = pedido_id;
        this.usuario_id = usuario_id;
        this.fechaPedido = fechaPedido;
        this.precioTotal = precioTotal;
        this.estado = estado;
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

    public Double getPrecioTotal() {
        return precioTotal;
    }

    public void setPrecioTotal(Double precioTotal) {
        this.precioTotal = precioTotal;
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }
}