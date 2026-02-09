package e_commerce.EntreLanas_Back.dtos;

import e_commerce.EntreLanas_Back.model.Enums.Categoria;
import e_commerce.EntreLanas_Back.model.vo.Dinero;

public class ProductoDetalleDTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private Dinero precio;
    private String imagen;
    private Integer stock;
    private Categoria categoria;

    
    public ProductoDetalleDTO() {
    }


    public ProductoDetalleDTO(Long id, String titulo, String descripcion, Dinero precio, String imagen, Integer stock,
            Categoria categoria) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.stock = stock;
        this.categoria = categoria;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
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
}