import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Un pedido se puede devolver si lleva menos de 30 días entregado
const puedeDevolver = (fechaPedido) => {
  const fecha = new Date(fechaPedido);
  const hoy = new Date();
  const diffDias = (hoy - fecha) / (1000 * 60 * 60 * 24);
  return diffDias <= 30;
};

const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Badge de color según el estado del pedido
const EstadoBadge = ({ estado }) => {
  const config = {
    PENDIENTE:  { bg: '#fff3cd', color: '#856404', icono: 'fa-clock' },
    PAGADO:     { bg: '#d1ecf1', color: '#0c5460', icono: 'fa-credit-card' },
    ENVIADO:    { bg: '#cce5ff', color: '#004085', icono: 'fa-truck' },
    ENTREGADO:  { bg: '#d4edda', color: '#155724', icono: 'fa-circle-check' },
    CANCELADO:  { bg: '#f8d7da', color: '#721c24', icono: 'fa-ban' },
  };
  const { bg, color, icono } = config[estado] ?? { bg: '#e2e3e5', color: '#383d41', icono: 'fa-question' };

  return (
    <span className="badge rounded-pill px-3 py-2 fw-semibold"
      style={{ backgroundColor: bg, color, fontSize: '0.8rem' }}>
      <i className={`fa-solid ${icono} me-1`}></i>
      {estado.charAt(0) + estado.slice(1).toLowerCase()}
    </span>
  );
};

function MisPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pedidoDetalle, setPedidoDetalle] = useState(null); // pedido expandido
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchPedidos = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/pedidos/usuario/${user.usuario_id}`
        );
        if (!response.ok) throw new Error('Error al cargar los pedidos');
        const data = await response.json();
        // Ordenar por fecha descendente (más reciente primero)
        const ordenados = data.sort(
          (a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido)
        );
        setPedidos(ordenados);
      } catch (err) {
        setError('No se han podido cargar tus pedidos. Inténtalo más tarde.');
      } finally {
        setCargando(false);
      }
    };

    fetchPedidos();
  }, [user]);

  // Cargar detalle con líneas al expandir un pedido
  const toggleDetalle = async (pedidoId) => {
    if (pedidoDetalle?.pedido_id === pedidoId) {
      setPedidoDetalle(null);
      return;
    }
    setCargandoDetalle(true);
    try {
      const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}`);
      if (!response.ok) throw new Error('Error al cargar el detalle');
      const data = await response.json();
      setPedidoDetalle(data);
    } catch {
      setError('No se pudo cargar el detalle del pedido.');
    } finally {
      setCargandoDetalle(false);
    }
  };

  // ── Guardia: no logueado ──
  if (!user) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center card-premium p-5" style={{ maxWidth: '500px' }}>
          <i className="fa-solid fa-lock text-accent mb-4" style={{ fontSize: '4rem' }}></i>
          <h2 className="logo-text mb-3">Acceso Restringido</h2>
          <p className="text-muted mb-4">Debes iniciar sesión para ver tus pedidos.</p>
          <Link to="/login" className="btn btn-primary-accent rounded-pill px-5 py-2">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  // ── Cargando ──
  if (cargando) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center">
          <div className="spinner-border text-accent mb-3"
            role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-muted">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  // ── Sin pedidos ──
  if (!cargando && pedidos.length === 0) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center p-5">
          <i className="fa-solid fa-bag-shopping text-muted mb-4 opacity-25"
            style={{ fontSize: '7rem' }}></i>
          <h2 className="logo-text mb-3" style={{ fontSize: '2.5rem' }}>
            Aún no tienes pedidos
          </h2>
          <p className="lead text-muted mb-5">
            Cuando realices tu primera compra, aparecerá aquí el historial completo.
          </p>
          <Link to="/productos"
            className="btn btn-primary-accent rounded-pill px-5 py-3 fs-5 shadow-sm">
            <i className="fa-solid fa-wand-magic-sparkles me-2"></i> Descubrir el Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow-1 py-5">
      <div className="container py-lg-4" style={{ maxWidth: '900px' }}>

        {/* Cabecera */}
        <div className="mb-5">
          <h2 className="logo-text fw-bold" style={{ fontSize: '2.2rem' }}>
            <i className="fa-solid fa-box-open text-accent me-3"></i>
            Mis Pedidos
          </h2>
          <p className="text-muted mt-1">
            Hola, <strong>{user.nombre}</strong>. Aquí tienes el historial de todas tus compras.
          </p>
        </div>

        {/* Error puntual */}
        {error && (
          <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2 mb-4">
            <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Tabla de pedidos */}
        <div className="card-premium overflow-hidden">
          <table className="table mb-0 align-middle">
            <thead style={{ backgroundColor: '#f8f5f0' }}>
              <tr>
                <th className="py-3 px-4 fw-semibold text-muted small text-uppercase"
                  style={{ letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)' }}>
                  Pedido
                </th>
                <th className="py-3 px-4 fw-semibold text-muted small text-uppercase"
                  style={{ letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)' }}>
                  Fecha
                </th>
                <th className="py-3 px-4 fw-semibold text-muted small text-uppercase"
                  style={{ letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)' }}>
                  Estado
                </th>
                <th className="py-3 px-4 fw-semibold text-muted small text-uppercase text-end"
                  style={{ letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)' }}>
                  Total
                </th>
                <th className="py-3 px-4 fw-semibold text-muted small text-uppercase text-center"
                  style={{ letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)' }}>
                  Devolución
                </th>
                <th style={{ borderBottom: '1px solid var(--border-color)' }}></th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => {
                const estaExpandido = pedidoDetalle?.pedido_id === pedido.pedido_id;
                const devolucionDisponible =
                  pedido.estado === 'ENTREGADO' && puedeDevolver(pedido.fechaPedido);

                return (
                  <>
                    {/* Fila principal del pedido */}
                    <tr key={pedido.pedido_id}
                      style={{ borderBottom: '1px solid var(--border-color, #f0ebe3)' }}>

                      {/* Número de pedido */}
                      <td className="py-3 px-4">
                        <span className="fw-bold text-dark logo-text" style={{ fontSize: '1rem' }}>
                          #{String(pedido.pedido_id).padStart(7, '0')}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="py-3 px-4 text-muted">
                        {formatearFecha(pedido.fechaPedido)}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-4">
                        <EstadoBadge estado={pedido.estado} />
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 text-end fw-bold text-dark">
                        {pedido.precioTotal} {pedido.moneda === 'EUR' ? '€' : pedido.moneda}
                      </td>

                      {/* Devolución */}
                      <td className="py-3 px-4 text-center">
                        {pedido.estado === 'ENTREGADO' ? (
                          devolucionDisponible ? (
                            <span className="badge rounded-pill px-3 py-2 fw-semibold"
                              style={{ backgroundColor: '#d4edda', color: '#155724', fontSize: '0.8rem' }}>
                              <i className="fa-solid fa-rotate-left me-1"></i> Disponible
                            </span>
                          ) : (
                            <span className="badge rounded-pill px-3 py-2 fw-semibold"
                              style={{ backgroundColor: '#e2e3e5', color: '#6c757d', fontSize: '0.8rem' }}>
                              <i className="fa-solid fa-xmark me-1"></i> No disponible
                            </span>
                          )
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>

                      {/* Botón expandir detalle */}
                      <td className="py-3 px-4 text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                          onClick={() => toggleDetalle(pedido.pedido_id)}
                          style={{ fontSize: '0.8rem' }}>
                          {estaExpandido
                            ? <><i className="fa-solid fa-chevron-up me-1"></i> Ocultar</>
                            : <><i className="fa-solid fa-chevron-down me-1"></i> Ver</>}
                        </button>
                      </td>
                    </tr>

                    {/* Fila de detalle expandible */}
                    {estaExpandido && (
                      <tr key={`detalle-${pedido.pedido_id}`}
                        style={{ backgroundColor: '#faf8f5' }}>
                        <td colSpan={6} className="px-4 py-3">
                          {cargandoDetalle ? (
                            <div className="text-center py-3">
                              <div className="spinner-border spinner-border-sm text-accent" role="status"></div>
                              <span className="text-muted ms-2 small">Cargando artículos...</span>
                            </div>
                          ) : (
                            <div className="d-flex flex-column gap-2">
                              <p className="text-muted small fw-semibold text-uppercase mb-2"
                                style={{ letterSpacing: '0.5px' }}>
                                Artículos del pedido
                              </p>
                              {pedidoDetalle?.lineas?.map((linea) => (
                                <div key={linea.linea_id}
                                  className="d-flex align-items-center justify-content-between py-2 px-3 rounded-3"
                                  style={{ backgroundColor: 'white', border: '1px solid var(--border-color, #f0ebe3)' }}>
                                  <div>
                                    <span className="fw-semibold text-dark">{linea.tituloProducto}</span>
                                    <span className="text-muted ms-2 small">x{linea.cantidad}</span>
                                  </div>
                                  <span className="fw-bold text-accent">
                                    {(linea.precioUnitario * linea.cantidad).toFixed(2)}{' '}
                                    {linea.moneda === 'EUR' ? '€' : linea.moneda}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resumen rápido de estadísticas */}
        <div className="row g-3 mt-4">
          <div className="col-6 col-md-3">
            <div className="card-premium p-3 text-center">
              <p className="logo-text fw-bold text-accent mb-0" style={{ fontSize: '1.8rem' }}>
                {pedidos.length}
              </p>
              <p className="text-muted small mb-0">Pedidos totales</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card-premium p-3 text-center">
              <p className="logo-text fw-bold text-accent mb-0" style={{ fontSize: '1.8rem' }}>
                {pedidos.filter(p => p.estado === 'ENTREGADO').length}
              </p>
              <p className="text-muted small mb-0">Entregados</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card-premium p-3 text-center">
              <p className="logo-text fw-bold text-accent mb-0" style={{ fontSize: '1.8rem' }}>
                {pedidos.filter(p => ['PENDIENTE', 'PAGADO', 'ENVIADO'].includes(p.estado)).length}
              </p>
              <p className="text-muted small mb-0">En curso</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card-premium p-3 text-center">
              <p className="logo-text fw-bold text-accent mb-0" style={{ fontSize: '1.8rem' }}>
                {pedidos
                  .reduce((acc, p) => acc + (parseFloat(p.precioTotal) || 0), 0)
                  .toFixed(2)} €
              </p>
              <p className="text-muted small mb-0">Total gastado</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MisPedidos;