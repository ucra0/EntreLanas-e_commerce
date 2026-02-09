package e_commerce.EntreLanas_Back.Controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import e_commerce.EntreLanas_Back.Services.AuthService;
import e_commerce.EntreLanas_Back.dtos.LoginDTO;
import e_commerce.EntreLanas_Back.dtos.RegistroDTO;
import e_commerce.EntreLanas_Back.model.Usuario;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegistroDTO registroDTO) {
        // --- DEBUG: IMPRIMIR LO QUE LLEGA ---
        System.out.println(">>> INTENTO DE REGISTRO <<<");
        if (registroDTO == null) {
            System.out.println("❌ ERROR: registroDTO es NULL (El JSON no ha llegado bien)");
            return ResponseEntity.badRequest().body("El cuerpo de la petición está vacío");
        }
        System.out.println("Username recibido: " + registroDTO.getUsername());
        System.out.println("Email recibido: " + registroDTO.getEmail());
        // ------------------------------------

        try {
            String mensaje = authService.registrarUsuario(registroDTO);
            return ResponseEntity.ok(mensaje);
        } catch (Exception e) {
            e.printStackTrace(); // Imprime el error real en la consola negra
            return ResponseEntity.badRequest().body("Error al registrar: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        System.out.println(">>> INTENTO DE LOGIN <<<");
        try {
            Usuario usuarioLogueado = authService.login(loginDTO);
            return ResponseEntity.ok(usuarioLogueado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error login: " + e.getMessage());
        }
    }
}