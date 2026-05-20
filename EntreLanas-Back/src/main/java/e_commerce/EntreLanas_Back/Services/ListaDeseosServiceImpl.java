package e_commerce.EntreLanas_Back.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import e_commerce.EntreLanas_Back.dtos.ListaDeseosDTO;
import e_commerce.EntreLanas_Back.model.ListaDeseos;
import e_commerce.EntreLanas_Back.model.Producto;
import e_commerce.EntreLanas_Back.model.Usuario;
import e_commerce.EntreLanas_Back.repositories.ListaDeseosRepository;
import e_commerce.EntreLanas_Back.repositories.ProductoRepository;
import e_commerce.EntreLanas_Back.repositories.UsuarioRepository;

@Service
public class ListaDeseosServiceImpl implements ListaDeseosService {

    @Autowired
    private ListaDeseosRepository listaDeseosRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private ProductoRepository productoRepo;

    @Override
    public List<ListaDeseosDTO> listarDeseos(Long usuarioId) {
        return listaDeseosRepo.findByUsuarioId(usuarioId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ListaDeseosDTO añadirDeseo(Long usuarioId, Long productoId) {

        if (listaDeseosRepo.existsByUsuarioIdAndProductoId(usuarioId, productoId)) {
            throw new RuntimeException("El producto ya está en la lista de deseos");
        }

        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario con id " + usuarioId + " no encontrado"));

        Producto producto = productoRepo.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto con id " + productoId + " no encontrado"));

        if (producto.getStock() > 0) {
            throw new RuntimeException("Solo se pueden añadir a la lista de deseos productos sin stock");
        }

        ListaDeseos deseo = new ListaDeseos(usuario, producto);
        ListaDeseos guardado = listaDeseosRepo.save(deseo);
        return toDTO(guardado);
    }

    @Override
    public void eliminarDeseo(Long deseoId) {
        if (!listaDeseosRepo.existsById(deseoId)) {
            throw new RuntimeException("Deseo con id " + deseoId + " no encontrado");
        }
        listaDeseosRepo.deleteById(deseoId);
    }

    @Override
    public boolean esDeseo(Long usuarioId, Long productoId) {
        return listaDeseosRepo.existsByUsuarioIdAndProductoId(usuarioId, productoId);
    }

    private ListaDeseosDTO toDTO(ListaDeseos l) {
        return new ListaDeseosDTO(
            l.getDeseo_id(),
            l.getProducto().getProducto_id(),
            l.getProducto().getTitulo(),
            l.getProducto().getImagen(),
            l.getProducto().getPrecio(),
            l.getProducto().getStock(),
            l.getProducto().getCategoria()
        );
    }
}