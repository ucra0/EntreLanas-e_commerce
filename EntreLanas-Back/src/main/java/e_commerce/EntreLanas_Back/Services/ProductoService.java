package e_commerce.EntreLanas_Back.Services;

import java.util.List;

import e_commerce.EntreLanas_Back.dtos.ProductoDetalleDTO;
import e_commerce.EntreLanas_Back.dtos.ProductoResumenDTO;
import e_commerce.EntreLanas_Back.model.Enums.Categoria;

public interface ProductoService {

    // Devuelve una lista ligera (solo resumen)
    List<ProductoResumenDTO> listarTodos();
    
    // Devuelve una lista ligera filtrada por categoría
    List<ProductoResumenDTO> listarPorCategoria(Categoria categoria);
    
    // Devuelve el detalle completo de un solo producto
    ProductoDetalleDTO obtenerPorId(Long id);

    // Crear un producto nuevo (Devuelve el detalle del creado)
    ProductoDetalleDTO crearProducto(ProductoDetalleDTO productoDTO);

    // Actualizar un producto existente
    ProductoDetalleDTO actualizarProducto(Long id, ProductoDetalleDTO productoDTO);

    // Eliminar un producto
    void eliminarProducto(Long id);

    // Buscar productos por nombre (Vital para la barra de búsqueda)
    List<ProductoResumenDTO> buscarPorNombre(String texto);
}
