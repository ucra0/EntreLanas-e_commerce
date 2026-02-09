package e_commerce.EntreLanas_Back.Services;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import e_commerce.EntreLanas_Back.dtos.LoginDTO;
import e_commerce.EntreLanas_Back.dtos.RegistroDTO;
import e_commerce.EntreLanas_Back.model.Usuario;
import e_commerce.EntreLanas_Back.model.vo.Email;
import e_commerce.EntreLanas_Back.repositories.UsuarioRepository;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    
    private final UsuarioRepository usuarioRepo;


    public AuthServiceImpl(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    @Override
    @Transactional
    public String registrarUsuario(RegistroDTO dto) {
        
        System.out.println(">>> SERVICIO: Intentando registrar a " + dto.getUsername());

        if (usuarioRepo.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("El usuario ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(dto.getPassword());
        usuario.setNombre(dto.getNombre());
        usuario.setApellidos(dto.getApellidos());
        
        try {
            usuario.setEmail(new Email(dto.getEmail()));
        } catch (Exception e) {
             usuario.setEmail(new Email("error@error.com"));
        }

        usuarioRepo.save(usuario);
        System.out.println(">>> SERVICIO: Usuario guardado correctamente");
        return "Usuario registrado con éxito";
    }

    @Override
    public Usuario login(LoginDTO loginDTO) {
        // USAMOS EL NUEVO REPO
        Optional<Usuario> userOpt = usuarioRepo.findByUsername(loginDTO.getUsername());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado en BD");
        }
        Usuario usuario = userOpt.get();
        if (!usuario.getPassword().equals(loginDTO.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        return usuario;
    }
}