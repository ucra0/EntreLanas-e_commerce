package e_commerce.EntreLanas_Back.Services;

import java.util.List;
import e_commerce.EntreLanas_Back.dtos.UsuarioResponseDTO;
import e_commerce.EntreLanas_Back.model.Enums.Rol;

public interface UsuarioService {

    // Listar todos los usuarios
    List<UsuarioResponseDTO> listarTodos();

    // Obtener un usuario por id
    UsuarioResponseDTO obtenerPorId(Long id);

    // Cambiar el rol de un usuario
    UsuarioResponseDTO cambiarRol(Long id, Rol nuevoRol);

    // Eliminar un usuario
    void eliminarUsuario(Long id);
}