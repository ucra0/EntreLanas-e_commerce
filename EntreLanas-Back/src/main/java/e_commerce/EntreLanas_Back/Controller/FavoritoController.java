package e_commerce.EntreLanas_Back.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import e_commerce.EntreLanas_Back.Services.FavoritoService;
import e_commerce.EntreLanas_Back.dtos.FavoritoDTO;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    // 1. LISTAR FAVORITOS DE UN USUARIO
    // Ej: GET /api/favoritos/usuario/2
    @GetMapping("/usuario/{usuarioId}")
    public List<FavoritoDTO> listarFavoritos(@PathVariable Long usuarioId) {
        return favoritoService.listarFavoritos(usuarioId);
    }

    // 2. AÑADIR A FAVORITOS
    // Ej: POST /api/favoritos?usuarioId=2&productoId=5
    @PostMapping
    public ResponseEntity<FavoritoDTO> añadirFavorito(@RequestParam Long usuarioId,
                                                       @RequestParam Long productoId) {
        FavoritoDTO favorito = favoritoService.añadirFavorito(usuarioId, productoId);
        return new ResponseEntity<>(favorito, HttpStatus.CREATED);
    }

    // 3. ELIMINAR DE FAVORITOS
    // Ej: DELETE /api/favoritos/1
    @DeleteMapping("/{favoritoId}")
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Long favoritoId) {
        favoritoService.eliminarFavorito(favoritoId);
        return ResponseEntity.noContent().build();
    }

    // 4. COMPROBAR SI ES FAVORITO
    // Ej: GET /api/favoritos/check?usuarioId=2&productoId=5
    @GetMapping("/check")
    public ResponseEntity<Boolean> esFavorito(@RequestParam Long usuarioId,
                                               @RequestParam Long productoId) {
        return ResponseEntity.ok(favoritoService.esFavorito(usuarioId, productoId));
    }
}