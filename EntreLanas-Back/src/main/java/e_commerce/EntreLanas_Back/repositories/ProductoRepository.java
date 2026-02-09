package e_commerce.EntreLanas_Back.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import e_commerce.EntreLanas_Back.model.Producto;
import e_commerce.EntreLanas_Back.model.Enums.Categoria;


public interface ProductoRepository extends JpaRepository <Producto, Long> {

    List<Producto> findByCategoria(Categoria categoria);

    // Busca productos cuyo título CONTENGA el texto (ignorando mayúsculas/minúsculas si la BD lo soporta)
    List<Producto> findByTituloContaining(String texto);
}
