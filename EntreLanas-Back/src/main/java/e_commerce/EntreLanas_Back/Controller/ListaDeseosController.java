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

import e_commerce.EntreLanas_Back.Services.ListaDeseosService;
import e_commerce.EntreLanas_Back.dtos.ListaDeseosDTO;

@RestController
@RequestMapping("/api/deseos")
@CrossOrigin(origins = "http://localhost:5173")
public class ListaDeseosController {

    @Autowired
    private ListaDeseosService listaDeseosService;

    // GET /api/deseos/usuario/2
    @GetMapping("/usuario/{usuarioId}")
    public List<ListaDeseosDTO> listarDeseos(@PathVariable Long usuarioId) {
        return listaDeseosService.listarDeseos(usuarioId);
    }

    // POST /api/deseos?usuarioId=2&productoId=5
    @PostMapping
    public ResponseEntity<ListaDeseosDTO> añadirDeseo(@RequestParam Long usuarioId,
                                                       @RequestParam Long productoId) {
        ListaDeseosDTO deseo = listaDeseosService.añadirDeseo(usuarioId, productoId);
        return new ResponseEntity<>(deseo, HttpStatus.CREATED);
    }

    // DELETE /api/deseos/1
    @DeleteMapping("/{deseoId}")
    public ResponseEntity<Void> eliminarDeseo(@PathVariable Long deseoId) {
        listaDeseosService.eliminarDeseo(deseoId);
        return ResponseEntity.noContent().build();
    }

    // GET /api/deseos/check?usuarioId=2&productoId=5
    @GetMapping("/check")
    public ResponseEntity<Boolean> esDeseo(@RequestParam Long usuarioId,
                                            @RequestParam Long productoId) {
        return ResponseEntity.ok(listaDeseosService.esDeseo(usuarioId, productoId));
    }
}