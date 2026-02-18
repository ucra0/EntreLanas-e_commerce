package e_commerce.EntreLanas_Back.dtos;

import e_commerce.EntreLanas_Back.model.Enums.Categoria;
import e_commerce.EntreLanas_Back.model.Enums.Color;
import e_commerce.EntreLanas_Back.model.Enums.Talla;
import e_commerce.EntreLanas_Back.model.Enums.Fibra;
import e_commerce.EntreLanas_Back.model.Enums.Estilos;
import e_commerce.EntreLanas_Back.model.Enums.Tipos;
import e_commerce.EntreLanas_Back.model.vo.Dinero;

public class ProductoResumenDTO {

    private Long id;
    private String titulo;
    private Dinero precio;
    private String imagen;
    private Integer stock; 
    private Categoria categoria;
    
    
    private Color color;
    private Talla talla;
    private Fibra fibra;
    private Estilos estilo;
    private Tipos tipo;

    public ProductoResumenDTO() {
    }

    
    public ProductoResumenDTO(Long id, String titulo, Dinero precio, String imagen, Integer stock, Categoria categoria,
                              Color color, Talla talla, Fibra fibra, Estilos estilo, Tipos tipo) {
        this.id = id;
        this.titulo = titulo;
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

   
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public Dinero getPrecio() { return precio; }
    public void setPrecio(Dinero precio) { this.precio = precio; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public Color getColor() { return color; }
    public void setColor(Color color) { this.color = color; }

    public Talla getTalla() { return talla; }
    public void setTalla(Talla talla) { this.talla = talla; }

    public Fibra getFibra() { return fibra; }
    public void setFibra(Fibra fibra) { this.fibra = fibra; }

    public Estilos getEstilo() { return estilo; }
    public void setEstilo(Estilos estilo) { this.estilo = estilo; }

    public Tipos getTipo() { return tipo; }
    public void setTipo(Tipos tipo) { this.tipo = tipo; }
}