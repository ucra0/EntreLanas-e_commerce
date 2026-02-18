package e_commerce.EntreLanas_Back.Mappers;

import org.springframework.stereotype.Component;

import e_commerce.EntreLanas_Back.dtos.ProductoDetalleDTO;
import e_commerce.EntreLanas_Back.dtos.ProductoResumenDTO;
import e_commerce.EntreLanas_Back.model.Producto;

@Component
public class ProductoMapper {

    
    public ProductoResumenDTO toResumenDTO(Producto producto){
        if (producto == null) return null; 

        return new ProductoResumenDTO(
            producto.getProducto_id(),
            producto.getTitulo(),
            producto.getPrecio(),
            producto.getImagen(),
            producto.getStock(),     
            producto.getCategoria(),
            producto.getColor(),     
            producto.getTalla(),
            producto.getFibra(),
            producto.getEstilo(),
            producto.getTipo()
        );
    }

    
    public ProductoDetalleDTO toDetalleDTO(Producto producto){
        if (producto == null) return null;

        return new ProductoDetalleDTO(
            producto.getProducto_id(),
            producto.getTitulo(),
            producto.getDescripcion(),
            producto.getPrecio(),
            producto.getImagen(),
            producto.getStock(),
            producto.getCategoria(),
            producto.getColor(),     
            producto.getTalla(),
            producto.getFibra(),
            producto.getEstilo(),
            producto.getTipo()
        );
    }

    
    public Producto toEntity(ProductoDetalleDTO dto){
        if (dto == null) return null;

        Producto producto = new Producto();
        
        producto.setProducto_id(dto.getId());
        
        producto.setTitulo(dto.getTitulo());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setImagen(dto.getImagen());
        producto.setStock(dto.getStock());
        producto.setCategoria(dto.getCategoria());
        
        
        producto.setColor(dto.getColor());
        producto.setTalla(dto.getTalla());
        producto.setFibra(dto.getFibra());
        producto.setEstilo(dto.getEstilo());
        producto.setTipo(dto.getTipo());

        return producto;
    }
}