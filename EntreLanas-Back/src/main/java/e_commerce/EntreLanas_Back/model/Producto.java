package e_commerce.EntreLanas_Back.model;

import e_commerce.EntreLanas_Back.model.Enums.Categoria;
import e_commerce.EntreLanas_Back.model.Enums.Color;
import e_commerce.EntreLanas_Back.model.Enums.Estilos;
import e_commerce.EntreLanas_Back.model.Enums.Fibra;
import e_commerce.EntreLanas_Back.model.Enums.Talla;
import e_commerce.EntreLanas_Back.model.Enums.Tipos;
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
    @Enumerated(EnumType.STRING)
    @Column(name = "color")
    private Color color;
    @Enumerated(EnumType.STRING)
    @Column(name = "talla")
    private Talla talla;
    @Enumerated(EnumType.STRING)
    @Column(name = "fibra")
    private Fibra fibra;
    @Enumerated(EnumType.STRING)
    @Column(name = "estilo")
    private Estilos estilo;
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private Tipos tipo;
    
    
    
    public Producto() {
    }



    public Producto(Long producto_id, String titulo, String descripcion, Dinero precio, String imagen, Integer stock,
            Categoria categoria, Color color, Talla talla, Fibra fibra, Estilos estilo, Tipos tipo) {
        this.producto_id = producto_id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.stock = stock;
        this.categoria = categoria;
        this.color = color;
        this.talla = talla;
        this.fibra = fibra;
        this.estilo = estilo;
        this.tipo = tipo;
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



    public Color getColor() {
        return color;
    }



    public void setColor(Color color) {
        this.color = color;
    }



    public Talla getTalla() {
        return talla;
    }



    public void setTalla(Talla talla) {
        this.talla = talla;
    }



    public Fibra getFibra() {
        return fibra;
    }



    public void setFibra(Fibra fibra) {
        this.fibra = fibra;
    }



    public Estilos getEstilo() {
        return estilo;
    }



    public void setEstilo(Estilos estilo) {
        this.estilo = estilo;
    }



    public Tipos getTipo() {
        return tipo;
    }



    public void setTipo(Tipos tipo) {
        this.tipo = tipo;
    }



    @Override
    public String toString() {
        return "Producto [producto_id=" + producto_id + ", titulo=" + titulo + ", descripcion=" + descripcion
                + ", precio=" + precio + ", imagen=" + imagen + ", stock=" + stock + ", categoria=" + categoria
                + ", color=" + color + ", talla=" + talla + ", fibra=" + fibra + ", estilo=" + estilo + ", tipo=" + tipo
                + "]";
    }    
}