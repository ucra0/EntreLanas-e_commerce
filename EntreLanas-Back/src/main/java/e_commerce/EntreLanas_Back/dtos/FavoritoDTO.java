package e_commerce.EntreLanas_Back.dtos;

import e_commerce.EntreLanas_Back.model.Enums.Categoria;
import e_commerce.EntreLanas_Back.model.vo.Dinero;

public class FavoritoDTO {

    private Long favorito_id;
    private Long producto_id;
    private String titulo;
    private String imagen;
    private Dinero precio;
    private Integer stock;
    private Categoria categoria;


    public FavoritoDTO() {}

    public FavoritoDTO(Long favorito_id, Long producto_id, String titulo,
                       String imagen, Dinero precio, Integer stock, Categoria categoria) {
        this.favorito_id = favorito_id;
        this.producto_id = producto_id;
        this.titulo = titulo;
        this.imagen = imagen;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
    }


    public Long getFavorito_id() { return favorito_id; }
    public void setFavorito_id(Long favorito_id) { this.favorito_id = favorito_id; }

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