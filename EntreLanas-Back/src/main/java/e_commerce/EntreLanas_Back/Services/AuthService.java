package e_commerce.EntreLanas_Back.Services;

import e_commerce.EntreLanas_Back.dtos.LoginDTO;
import e_commerce.EntreLanas_Back.dtos.RegistroDTO;
import e_commerce.EntreLanas_Back.model.Usuario;

public interface AuthService {

    // El registro devuelve un mensaje de texto (ej: "Usuario registrado")
    String registrarUsuario(RegistroDTO registroDTO);

    // EL CAMBIO ESTÁ AQUÍ 👇
    // Antes devolvía String (Token), ahora devuelve el objeto Usuario entero
    Usuario login(LoginDTO loginDTO);
}