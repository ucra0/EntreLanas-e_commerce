package e_commerce.EntreLanas_Back.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import e_commerce.EntreLanas_Back.Services.UsuarioService;
import e_commerce.EntreLanas_Back.dtos.UsuarioResponseDTO;
import e_commerce.EntreLanas_Back.model.Enums.Rol;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // 1. LISTAR TODOS
    // Ej: GET /api/usuarios
    @GetMapping
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioService.listarTodos();
    }

    // 2. OBTENER POR ID
    // Ej: GET /api/usuarios/1
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    // 3. CAMBIAR ROL
    // Ej: PATCH /api/usuarios/1/rol?nuevoRol=ROLE_ADMIN
    @PatchMapping("/{id}/rol")
    public ResponseEntity<UsuarioResponseDTO> cambiarRol(@PathVariable Long id,
                                                          @RequestParam Rol nuevoRol) {
        return ResponseEntity.ok(usuarioService.cambiarRol(id, nuevoRol));
    }

    // 4. ELIMINAR USUARIO
    // Ej: DELETE /api/usuarios/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}