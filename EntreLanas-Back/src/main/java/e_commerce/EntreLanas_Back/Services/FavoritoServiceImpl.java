package e_commerce.EntreLanas_Back.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import e_commerce.EntreLanas_Back.dtos.FavoritoDTO;
import e_commerce.EntreLanas_Back.model.Favorito;
import e_commerce.EntreLanas_Back.model.Producto;
import e_commerce.EntreLanas_Back.model.Usuario;
import e_commerce.EntreLanas_Back.repositories.FavoritoRepository;
import e_commerce.EntreLanas_Back.repositories.ProductoRepository;
import e_commerce.EntreLanas_Back.repositories.UsuarioRepository;

@Service
public class FavoritoServiceImpl implements FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private ProductoRepository productoRepo;

    @Override
    public List<FavoritoDTO> listarFavoritos(Long usuarioId) {
        return favoritoRepo.findByUsuarioId(usuarioId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FavoritoDTO añadirFavorito(Long usuarioId, Long productoId) {

        if (favoritoRepo.existsByUsuarioIdAndProductoId(usuarioId, productoId)) {
            throw new RuntimeException("El producto ya está en favoritos");
        }

        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario con id " + usuarioId + " no encontrado"));

        Producto producto = productoRepo.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto con id " + productoId + " no encontrado"));

        Favorito favorito = new Favorito(usuario, producto);
        Favorito guardado = favoritoRepo.save(favorito);
        return toDTO(guardado);
    }

    @Override
    public void eliminarFavorito(Long favoritoId) {
        if (!favoritoRepo.existsById(favoritoId)) {
            throw new RuntimeException("Favorito con id " + favoritoId + " no encontrado");
        }
        favoritoRepo.deleteById(favoritoId);
    }

    @Override
    public boolean esFavorito(Long usuarioId, Long productoId) {
        return favoritoRepo.existsByUsuarioIdAndProductoId(usuarioId, productoId);
    }

    private FavoritoDTO toDTO(Favorito f) {
        return new FavoritoDTO(
            f.getFavorito_id(),
            f.getProducto().getProducto_id(),
            f.getProducto().getTitulo(),
            f.getProducto().getImagen(),
            f.getProducto().getPrecio(),
            f.getProducto().getStock(),
            f.getProducto().getCategoria()
        );
    }
}