package e_commerce.EntreLanas_Back.dtos;

public class LineaPedidoDTO {

    private Long linea_id;
    private Long producto_id;
    private String tituloProducto;
    private Integer cantidad;
    private Double precioUnitario;


    public LineaPedidoDTO() {
    }

    public LineaPedidoDTO(Long linea_id, Long producto_id, String tituloProducto,
                          Integer cantidad, Double precioUnitario) {
        this.linea_id = linea_id;
        this.producto_id = producto_id;
        this.tituloProducto = tituloProducto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }


    public Long getLinea_id() {
        return linea_id;
    }

    public void setLinea_id(Long linea_id) {
        this.linea_id = linea_id;
    }

    public Long getProducto_id() {
        return producto_id;
    }

    public void setProducto_id(Long producto_id) {
        this.producto_id = producto_id;
    }

    public String getTituloProducto() {
        return tituloProducto;
    }

    public void setTituloProducto(String tituloProducto) {
        this.tituloProducto = tituloProducto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}