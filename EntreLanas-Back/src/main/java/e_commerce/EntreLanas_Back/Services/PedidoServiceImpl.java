package e_commerce.EntreLanas_Back.Services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import e_commerce.EntreLanas_Back.Mappers.PedidoMapper;
import e_commerce.EntreLanas_Back.dtos.LineaPedidoDTO;
import e_commerce.EntreLanas_Back.dtos.PedidoDetalleDTO;
import e_commerce.EntreLanas_Back.dtos.PedidoResumenDTO;
import e_commerce.EntreLanas_Back.model.LineaPedido;
import e_commerce.EntreLanas_Back.model.Pedido;
import e_commerce.EntreLanas_Back.model.Producto;
import e_commerce.EntreLanas_Back.model.Usuario;
import e_commerce.EntreLanas_Back.model.Enums.EstadoPedido;
import e_commerce.EntreLanas_Back.model.vo.Dinero;
import e_commerce.EntreLanas_Back.repositories.PedidoRepository;
import e_commerce.EntreLanas_Back.repositories.ProductoRepository;
import e_commerce.EntreLanas_Back.repositories.UsuarioRepository;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository pedidoRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private ProductoRepository productoRepo;

    @Autowired
    private PedidoMapper pedidoMapper;

    @Override
    public List<PedidoResumenDTO> listarTodos() {
        return pedidoRepo.findAll().stream()
                .map(pedidoMapper::toResumenDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PedidoResumenDTO> listarPorUsuario(Long usuarioId) {
        return pedidoRepo.findByUsuarioId(usuarioId).stream()
                .map(pedidoMapper::toResumenDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PedidoResumenDTO> listarPorEstado(EstadoPedido estado) {
        return pedidoRepo.findByEstado(estado).stream()
                .map(pedidoMapper::toResumenDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PedidoDetalleDTO obtenerPorId(Long id) {
        Pedido pedido = pedidoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido con id " + id + " no encontrado"));
        return pedidoMapper.toDetalleDTO(pedido);
    }

    @Override
    public PedidoDetalleDTO crearPedido(PedidoDetalleDTO pedidoDTO) {

        
        Usuario usuario = usuarioRepo.findById(pedidoDTO.getUsuario_id())
            .orElseThrow(() -> new RuntimeException("Usuario con id " + pedidoDTO.getUsuario_id() + " no encontrado"));

        
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        
        BigDecimal precioTotal = BigDecimal.ZERO;

        for (LineaPedidoDTO lineaDTO : pedidoDTO.getLineas()) {

            Producto producto = productoRepo.findById(lineaDTO.getProducto_id())
                .orElseThrow(() -> new RuntimeException("Producto con id " + lineaDTO.getProducto_id() + " no encontrado"));

            LineaPedido linea = new LineaPedido();
            linea.setPedido(pedido);
            linea.setProducto(producto);
            linea.setCantidad(lineaDTO.getCantidad());
            linea.setPrecioUnitario(producto.getPrecio()); 

            
            BigDecimal subtotal = producto.getPrecio().getImporte()
                .multiply(BigDecimal.valueOf(lineaDTO.getCantidad()));
            precioTotal = precioTotal.add(subtotal);

            pedido.getLineas().add(linea);
        }

        
        String moneda = pedido.getLineas().get(0).getPrecioUnitario().getMoneda();
        pedido.setPrecioTotal(new Dinero(precioTotal, moneda));

        Pedido pedidoGuardado = pedidoRepo.save(pedido);
        return pedidoMapper.toDetalleDTO(pedidoGuardado);
    }

    @Override
    public PedidoResumenDTO actualizarEstado(Long id, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("No se puede actualizar, pedido con id " + id + " no encontrado"));

        pedido.setEstado(nuevoEstado);
        Pedido pedidoActualizado = pedidoRepo.save(pedido);
        return pedidoMapper.toResumenDTO(pedidoActualizado);
    }

    @Override
    public PedidoResumenDTO cancelarPedido(Long id) {
        Pedido pedido = pedidoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("No se puede cancelar, pedido con id " + id + " no encontrado"));

        if (pedido.getEstado() == EstadoPedido.ENTREGADO) {
            throw new RuntimeException("No se puede cancelar un pedido ya entregado");
        }

        pedido.setEstado(EstadoPedido.CANCELADO);
        Pedido pedidoCancelado = pedidoRepo.save(pedido);
        return pedidoMapper.toResumenDTO(pedidoCancelado);
    }
}