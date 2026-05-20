package e_commerce.EntreLanas_Back.dtos;

import e_commerce.EntreLanas_Back.model.Enums.Categoria;
import e_commerce.EntreLanas_Back.model.vo.Dinero;

public class ListaDeseosDTO {

    private Long deseo_id;
    private Long producto_id;
    private String titulo;
    private String imagen;
    private Dinero precio;
    private Integer stock;
    private Categoria categoria;


    public ListaDeseosDTO() {}

    public ListaDeseosDTO(Long deseo_id, Long producto_id, String titulo,
                          String imagen, Dinero precio, Integer stock, Categoria categoria) {
        this.deseo_id   = deseo_id;
        this.producto_id = producto_id;
        this.titulo     = titulo;
        this.imagen     = imagen;
        this.precio     = precio;
        this.stock      = stock;
        this.categoria  = categoria;
    }


    public Long getDeseo_id() { return deseo_id; }
    public void setDeseo_id(Long deseo_id) { this.deseo_id = deseo_id; }

    public Long getProducto_id() { return producto_id; }
    public void setProducto_id(Long producto_id) { this.producto_id = producto_id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public Dinero getPrecio() { return precio; }
    public void setPrecio(Dinero precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}