package e_commerce.EntreLanas_Back.model;

import e_commerce.EntreLanas_Back.model.vo.Dinero;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lineas_pedido")
public class LineaPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long linea_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "importe", column = @Column(name = "precio_unitario", nullable = false, scale = 2)),
        @AttributeOverride(name = "moneda", column = @Column(name = "moneda_unitario", nullable = false, length = 3))
    })
    private Dinero precioUnitario;


    public LineaPedido() {
    }

    public LineaPedido(Long linea_id, Pedido pedido, Producto producto,
                       Integer cantidad, Dinero precioUnitario) {
        this.linea_id = linea_id;
        this.pedido = pedido;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }


    public Long getLinea_id() {
        return linea_id;
    }

    public void setLinea_id(Long linea_id) {
        this.linea_id = linea_id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Dinero getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Dinero precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    @Override
    public String toString() {
        return "LineaPedido [linea_id=" + linea_id + ", producto=" + producto
                + ", cantidad=" + cantidad + ", precioUnitario=" + precioUnitario + "]";
    }
}