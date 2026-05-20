package e_commerce.EntreLanas_Back.Services;

import java.util.List;
import e_commerce.EntreLanas_Back.dtos.FavoritoDTO;

public interface FavoritoService {

    // Listar favoritos de un usuario
    List<FavoritoDTO> listarFavoritos(Long usuarioId);

    // Añadir a favoritos — devuelve el favorito creado
    FavoritoDTO añadirFavorito(Long usuarioId, Long productoId);

    // Eliminar de favoritos por su id
    void eliminarFavorito(Long favoritoId);

    // Comprobar si un producto ya es favorito del usuario
    boolean esFavorito(Long usuarioId, Long productoId);
}