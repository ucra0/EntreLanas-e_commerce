package e_commerce.EntreLanas_Back.model.vo;

import jakarta.persistence.Embeddable;
import java.math.BigDecimal;
import java.util.Objects;

@Embeddable
public class Dinero {

    private BigDecimal importe;
    private String moneda;

    public Dinero() {
        this.importe = null;
        this.moneda = null;
    }

    public Dinero(BigDecimal importe, String moneda) {
        if (importe == null || importe.scale() > 2) {
            throw new IllegalArgumentException("El importe no puede ser nulo y debe tener como máximo 2 decimales.");
        }
        if (moneda == null || moneda.trim().isEmpty()) {
            throw new IllegalArgumentException("La moneda no puede ser nula o vacía.");
        }
        this.importe = importe;
        this.moneda = moneda;
    }


    public Dinero(Double importe, String moneda) {
        this(BigDecimal.valueOf(importe), moneda);
    }

    
    public BigDecimal getImporte() {
        return importe;
    }

    public String getMoneda() {
        return moneda;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Dinero dinero = (Dinero) o;
        return Objects.equals(importe, dinero.importe) &&
               Objects.equals(moneda, dinero.moneda);
    }

    @Override
    public int hashCode() {
        return Objects.hash(importe, moneda);
    }

    @Override
    public String toString() {
        return importe + " " + moneda;
    }
}