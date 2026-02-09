package e_commerce.EntreLanas_Back.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import e_commerce.EntreLanas_Back.Services.ProductoService;
import e_commerce.EntreLanas_Back.dtos.ProductoDetalleDTO;
import e_commerce.EntreLanas_Back.dtos.ProductoResumenDTO;
import e_commerce.EntreLanas_Back.model.Enums.Categoria;


@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173") // Permite la conexión desde React (Vite)
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // 1. LISTAR TODOS O FILTRAR POR CATEGORÍA
    // Ej: GET /api/productos
    // Ej: GET /api/productos?categoria=AMIGURUMI
    @GetMapping
    public List<ProductoResumenDTO> listarProductos(@RequestParam(required = false) Categoria categoria) {
        if (categoria != null) {
            return productoService.listarPorCategoria(categoria);
        }
        return productoService.listarTodos();
    }

    // 2. BUSCAR POR NOMBRE
    // Ej: GET /api/productos/buscar?texto=lana
    @GetMapping("/buscar")
    public List<ProductoResumenDTO> buscarProductos(@RequestParam String texto) {
        return productoService.buscarPorNombre(texto);
    }

    // 3. OBTENER DETALLE (POR ID)
    // Ej: GET /api/productos/1
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDetalleDTO> obtenerDetalle(@PathVariable Long id) {
        // ResponseEntity nos permite controlar mejor el código HTTP de respuesta (200 OK)
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    // 4. CREAR PRODUCTO (ADMIN)
    // Ej: POST /api/productos
    @PostMapping
    public ResponseEntity<ProductoDetalleDTO> crearProducto(@RequestBody ProductoDetalleDTO dto) {
        ProductoDetalleDTO nuevoProducto = productoService.crearProducto(dto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED); // Devuelve código 201 (Created)
    }

    // 5. ACTUALIZAR PRODUCTO (ADMIN)
    // Ej: PUT /api/productos/1
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDetalleDTO> actualizarProducto(@PathVariable Long id, @RequestBody ProductoDetalleDTO dto) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, dto));
    }

    // 6. ELIMINAR PRODUCTO (ADMIN)
    // Ej: DELETE /api/productos/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build(); // Devuelve código 204 (Sin contenido, o sea, borrado OK)
    }
}