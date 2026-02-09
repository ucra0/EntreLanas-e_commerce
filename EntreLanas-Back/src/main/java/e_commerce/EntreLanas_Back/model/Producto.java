package e_commerce.EntreLanas_Back.model;

import e_commerce.EntreLanas_Back.model.Enums.Categoria;
import e_commerce.EntreLanas_Back.model.vo.Dinero;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long producto_id;

    @Column(name = "titulo", nullable = false, length = 100)
    private String titulo;
    @Column(name = "descripcion", nullable = false)
    private String descripcion;
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "importe", column = @Column(name = "precio", nullable = false, scale = 2)),
        @AttributeOverride(name = "moneda", column = @Column(name = "moneda", nullable = false, length = 3))
    })
    private Dinero precio;
    @Column(name = "imagen", nullable = false)
    private String imagen;
    @Column(name = "stock", nullable = false)
    private Integer stock;
    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", nullable = false)
    private Categoria categoria;
    
    
    
    public Producto() {
    }



    public Producto(Long producto_id, String titulo, String descripcion, Dinero precio, String imagen, Integer stock,
            Categoria categoria) {
        this.producto_id = producto_id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.stock = stock;
        this.categoria = categoria;
    }



    public Long getProducto_id() {
        return producto_id;
    }


    public void setProducto_id(Long producto_id) {
        this.producto_id = producto_id;
    }


    public String getTitulo() {
        return titulo;
    }


    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }


    public String getDescripcion() {
        return descripcion;
    }


    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }


    public Dinero getPrecio() {
        return precio;
    }


    public void setPrecio(Dinero precio) {
        this.precio = precio;
    }


    public String getImagen() {
        return imagen;
    }


    public void setImagen(String imagen) {
        this.imagen = imagen;
    }


    public Integer getStock() {
        return stock;
    }


    public void setStock(Integer stock) {
        this.stock = stock;
    }


    public Categoria getCategoria() {
        return categoria;
    }


    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }



    @Override
    public String toString() {
        return "Producto [producto_id=" + producto_id + ", titulo=" + titulo + ", descripcion=" + descripcion
                + ", precio=" + precio + ", imagen=" + imagen + ", stock=" + stock + ", categoria=" + categoria + "]";
    }
}