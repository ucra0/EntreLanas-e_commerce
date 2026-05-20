package e_commerce.EntreLanas_Back.Services;

import java.util.List;
import e_commerce.EntreLanas_Back.dtos.ListaDeseosDTO;

public interface ListaDeseosService {
    List<ListaDeseosDTO> listarDeseos(Long usuarioId);
    ListaDeseosDTO añadirDeseo(Long usuarioId, Long productoId);
    void eliminarDeseo(Long deseoId);
    boolean esDeseo(Long usuarioId, Long productoId);
}