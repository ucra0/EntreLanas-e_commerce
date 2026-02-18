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
        
        Producto producto = productoMapper.toEntity(productoDTO);
        
        
        Producto productoNuevo = productoRepo.save(producto);
        
        
        return productoMapper.toDetalleDTO(productoNuevo);
    }

    @Override
    public ProductoDetalleDTO actualizarProducto(Long id, ProductoDetalleDTO productoDTO) {
        
        Producto productoExistente = productoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("No se puede actualizar, producto no encontrado"));

        
        productoExistente.setTitulo(productoDTO.getTitulo());
        productoExistente.setDescripcion(productoDTO.getDescripcion());
        productoExistente.setPrecio(productoDTO.getPrecio());
        productoExistente.setImagen(productoDTO.getImagen());
        productoExistente.setStock(productoDTO.getStock());
        productoExistente.setCategoria(productoDTO.getCategoria());

        
        Producto productoActualizado = productoRepo.save(productoExistente);
        
        
        return productoMapper.toDetalleDTO(productoActualizado);
    }

    @Override
    public void eliminarProducto(Long id) {
        
        if (!productoRepo.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, producto no encontrado");
        }
    
        productoRepo.deleteById(id);
    }

    @Override
    public List<ProductoResumenDTO> buscarPorNombre(String texto) {
        
        List<Producto> productosEncontrados = productoRepo.findByTituloContaining(texto);
        
        return productosEncontrados.stream()
                .map(productoMapper::toResumenDTO)
                .collect(Collectors.toList());
    }
}