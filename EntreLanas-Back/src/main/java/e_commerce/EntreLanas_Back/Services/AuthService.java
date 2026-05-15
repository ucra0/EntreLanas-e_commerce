package e_commerce.EntreLanas_Back.Services;

import e_commerce.EntreLanas_Back.dtos.LoginDTO;
import e_commerce.EntreLanas_Back.dtos.RegistroDTO;
import e_commerce.EntreLanas_Back.dtos.UsuarioResponseDTO;

public interface AuthService {

    String registrarUsuario(RegistroDTO registroDTO);

    
    UsuarioResponseDTO login(LoginDTO loginDTO);
}