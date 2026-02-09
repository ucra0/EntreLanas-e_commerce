package e_commerce.EntreLanas_Back.model;

import e_commerce.EntreLanas_Back.model.vo.Email;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usuario_id;
    
    @Column(name = "username", unique = true, nullable = false)
    private String username;
    @Column(name = "password", nullable = false)
    private String password; 
    @Column(name = "nombre", nullable = false)
    private String nombre;
    @Column(name = "apellidos", nullable = false)
    private String apellidos;
    @Embedded
    @AttributeOverride(name = "valor", column = @Column(name = "email", unique = true, nullable = false))
    private Email email;



    public Usuario() {
    }


    public Usuario(Long usuario_id, String username, String password, String nombre, String apellidos, Email email) {
        this.usuario_id = usuario_id;
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
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



    public String getPassword() {
        return password;
    }



    public void setPassword(String password) {
        this.password = password;
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



    public Email getEmail() {
        return email;
    }



    public void setEmail(Email email) {
        this.email = email;
    }



    @Override
    public String toString() {
        return "Usuario [usuario_id=" + usuario_id + ", username=" + username + ", password=" + password + ", nombre="
                + nombre + ", apellidos=" + apellidos + ", email=" + email + "]";
    }
}