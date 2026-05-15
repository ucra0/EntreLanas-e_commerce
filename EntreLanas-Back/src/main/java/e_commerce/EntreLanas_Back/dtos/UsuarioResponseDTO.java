package e_commerce.EntreLanas_Back.dtos;

import e_commerce.EntreLanas_Back.model.Enums.Rol;

public class UsuarioResponseDTO {

    private Long usuario_id;
    private String username;
    private String nombre;
    private String apellidos;
    private String email;
    private Rol rol;


    public UsuarioResponseDTO() {
    }

    public UsuarioResponseDTO(Long usuario_id, String username, String nombre,
                               String apellidos, String email, Rol rol) {
        this.usuario_id = usuario_id;
        this.username = username;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.rol = rol;
    }


    public Long getUsuario_id() {
        return usuario_id;
    }

    public void setUsuario_id(Long usuario_id) {
        this.usuario_id = usuario_id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}