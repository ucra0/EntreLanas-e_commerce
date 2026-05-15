package e_commerce.EntreLanas_Back.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import e_commerce.EntreLanas_Back.Services.PedidoService;
import e_commerce.EntreLanas_Back.dtos.PedidoDetalleDTO;
import e_commerce.EntreLanas_Back.dtos.PedidoResumenDTO;
import e_commerce.EntreLanas_Back.model.Enums.EstadoPedido;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // 1. LISTAR TODOS O FILTRAR POR ESTADO (solo Admin)
    @GetMapping
    public List<PedidoResumenDTO> listarPedidos(@RequestParam(required = false) EstadoPedido estado) {
        if (estado != null) {
            return pedidoService.listarPorEstado(estado);
        }
        return pedidoService.listarTodos();
    }

    // 2. LISTAR PEDIDOS DE UN USUARIO CONCRETO
    @GetMapping("/usuario/{usuarioId}")
    public List<PedidoResumenDTO> listarPorUsuario(@PathVariable Long usuarioId) {
        return pedidoService.listarPorUsuario(usuarioId);
    }

    // 3. OBTENER DETALLE DE UN PEDIDO
    @GetMapping("/{id}")
    public ResponseEntity<PedidoDetalleDTO> obtenerDetalle(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.obtenerPorId(id));
    }

    // 4. CREAR UN NUEVO PEDIDO
    @PostMapping
    public ResponseEntity<PedidoDetalleDTO> crearPedido(@RequestBody PedidoDetalleDTO dto) {
        PedidoDetalleDTO nuevoPedido = pedidoService.crearPedido(dto);
        return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
    }

    // 5. ACTUALIZAR ESTADO DE UN PEDIDO (solo Admin)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<PedidoResumenDTO> actualizarEstado(@PathVariable Long id,
                                                              @RequestParam EstadoPedido nuevoEstado) {
        return ResponseEntity.ok(pedidoService.actualizarEstado(id, nuevoEstado));
    }

    // 6. CANCELAR UN PEDIDO
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<PedidoResumenDTO> cancelarPedido(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.cancelarPedido(id));
    }
}