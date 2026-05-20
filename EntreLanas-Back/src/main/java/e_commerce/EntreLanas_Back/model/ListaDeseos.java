package e_commerce.EntreLanas_Back.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "lista_deseos",
       uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "producto_id"}))
public class ListaDeseos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deseo_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;


    public ListaDeseos() {}

    public ListaDeseos(Usuario usuario, Producto producto) {
        this.usuario = usuario;
        this.producto = producto;
    }


    public Long getDeseo_id() { return deseo_id; }
    public void setDeseo_id(Long deseo_id) { this.deseo_id = deseo_id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    @Override
    public String toString() {
        return "ListaDeseos [deseo_id=" + deseo_id + ", usuario=" + usuario
                + ", producto=" + producto + "]";
    }
}