package e_commerce.EntreLanas_Back.model.vo;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.util.regex.Pattern;

@Embeddable 
public class Email {

    @Column(name = "email", unique = true, nullable = false)
    private String valor;

    
    protected Email() {}

    
    public Email(String valor) {
        if (valor == null || !isValid(valor)) {
            throw new IllegalArgumentException("El formato del email no es válido.");
        }
        this.valor = valor;
    }

    
    private boolean isValid(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return Pattern.compile(emailRegex).matcher(email).matches();
    }

    
    public String getValor() {
        return valor;
    }

    @Override
    public String toString() {
        return valor;
    }
}