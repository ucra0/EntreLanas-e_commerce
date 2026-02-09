package e_commerce.EntreLanas_Back.dtos;

import e_commerce.EntreLanas_Back.model.Enums.Categoria;
import e_commerce.EntreLanas_Back.model.vo.Dinero;

public class ProductoResumenDTO {

    private Long id;
    private String titulo;
    private Dinero precio;
    private String imagen;
    private Categoria categoria;


    public ProductoResumenDTO() {
    }


    public ProductoResumenDTO(Long id, String titulo, Dinero precio, String imagen, Categoria categoria) {
        this.id = id;
        this.titulo = titulo;
        this.precio = precio;
        this.imagen = imagen;
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


    public Categoria getCategoria() {
        return categoria;
    }


    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}