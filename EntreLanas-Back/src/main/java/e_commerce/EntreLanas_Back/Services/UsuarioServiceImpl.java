package e_commerce.EntreLanas_Back.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import e_commerce.EntreLanas_Back.dtos.UsuarioResponseDTO;
import e_commerce.EntreLanas_Back.model.Usuario;
import e_commerce.EntreLanas_Back.model.Enums.Rol;
import e_commerce.EntreLanas_Back.repositories.PedidoRepository;
import e_commerce.EntreLanas_Back.repositories.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private PedidoRepository pedidoRepo;

    @Override
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponseDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario con id " + id + " no encontrado"));
        return toDTO(usuario);
    }

    @Override
    public UsuarioResponseDTO cambiarRol(Long id, Rol nuevoRol) {
        Usuario usuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("No se puede actualizar, usuario con id " + id + " no encontrado"));
        usuario.setRol(nuevoRol);
        Usuario actualizado = usuarioRepo.save(usuario);
        return toDTO(actualizado);
    }

    @Override
    public void eliminarUsuario(Long id) {
        if (!usuarioRepo.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, usuario con id " + id + " no encontrado");
        }
        usuarioRepo.deleteById(id);
    }

    // Reutilizamos el UsuarioResponseDTO que ya tienes
    private UsuarioResponseDTO toDTO(Usuario u) {
    int numeroPedidos = pedidoRepo.findByUsuarioId(u.getUsuario_id()).size();
    return new UsuarioResponseDTO(
        u.getUsuario_id(),
        u.getUsername(),
        u.getNombre(),
        u.getApellidos(),
        u.getEmail().getValor(),
        u.getRol(),
        numeroPedidos
    );
}
}