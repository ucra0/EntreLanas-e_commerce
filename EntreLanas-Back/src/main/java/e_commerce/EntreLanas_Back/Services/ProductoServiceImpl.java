package e_commerce.EntreLanas_Back.Services;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import e_commerce.EntreLanas_Back.Mappers.ProductoMapper;
import e_commerce.EntreLanas_Back.dtos.ProductoDetalleDTO;
import e_commerce.EntreLanas_Back.dtos.ProductoResumenDTO;
import e_commerce.EntreLanas_Back.model.Producto;
import e_commerce.EntreLanas_Back.model.Enums.Categoria;
import e_commerce.EntreLanas_Back.repositories.ProductoRepository;



@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepo;

    @Autowired
    private ProductoMapper productoMapper;

    @Override
    public List<ProductoResumenDTO> listarTodos() {
        return productoRepo.findAll().stream()
            .map(productoMapper::toResumenDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<ProductoResumenDTO> listarPorCategoria(Categoria categoria) {
        return productoRepo.findByCategoria(categoria).stream()
                .map(productoMapper::toResumenDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductoDetalleDTO obtenerPorId(Long id) {
        Producto producto = productoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto con " + id + " no encontrado"));
        return productoMapper.toDetalleDTO(producto);
    }

    @Override
    public ProductoDetalleDTO crearProducto(ProductoDetalleDTO productoDTO) {
        // 1. Convertimos el DTO que viene de React a una Entidad
        Producto producto = productoMapper.toEntity(productoDTO);
        
        // 2. Guardamos en BD
        Producto productoNuevo = productoRepo.save(producto);
        
        // 3. Devolvemos el DTO resultante (con el nuevo ID generado)
        return productoMapper.toDetalleDTO(productoNuevo);
    }

    @Override
    public ProductoDetalleDTO actualizarProducto(Long id, ProductoDetalleDTO productoDTO) {
        // 1. Buscamos si existe el producto original
        Producto productoExistente = productoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("No se puede actualizar, producto no encontrado"));

        // 2. Actualizamos sus campos con los datos nuevos
        productoExistente.setTitulo(productoDTO.getTitulo());
        productoExistente.setDescripcion(productoDTO.getDescripcion());
        productoExistente.setPrecio(productoDTO.getPrecio());
        productoExistente.setImagen(productoDTO.getImagen());
        productoExistente.setStock(productoDTO.getStock());
        productoExistente.setCategoria(productoDTO.getCategoria());

        // 3. Guardamos los cambios
        Producto productoActualizado = productoRepo.save(productoExistente);
        
        // 4. Devolvemos el DTO actualizado
        return productoMapper.toDetalleDTO(productoActualizado);
    }

    @Override
    public void eliminarProducto(Long id) {
        // 1. Verificamos si existe (opcional, pero recomendado)
        if (!productoRepo.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, producto no encontrado");
        }
        // 2. Borramos
        productoRepo.deleteById(id);
    }

    @Override
    public List<ProductoResumenDTO> buscarPorNombre(String texto) {
        // Este método 'findByTituloContaining' hay que crearlo en el Repositorio
        List<Producto> productosEncontrados = productoRepo.findByTituloContaining(texto);
        
        return productosEncontrados.stream()
                .map(productoMapper::toResumenDTO)
                .collect(Collectors.toList());
    }
}