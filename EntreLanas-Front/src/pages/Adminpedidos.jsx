import { useState, useEffect } from 'react';

const ESTADOS = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

const ESTADO_CONFIG = {
  PENDIENTE:  { bg: '#fff3cd', color: '#856404', icono: 'fa-clock' },
  PAGADO:     { bg: '#d1ecf1', color: '#0c5460', icono: 'fa-credit-card' },
  ENVIADO:    { bg: '#cce5ff', color: '#004085', icono: 'fa-truck' },
  ENTREGADO:  { bg: '#d4edda', color: '#155724', icono: 'fa-circle-check' },
  CANCELADO:  { bg: '#f8d7da', color: '#721c24', icono: 'fa-ban' },
};

const EstadoBadge = ({ estado }) => {
  const { bg, color, icono } = ESTADO_CONFIG[estado] ?? { bg: '#e2e3e5', color: '#383d41', icono: 'fa-question' };
  return (
    <span className="badge rounded-pill px-3 py-2 fw-semibold"
      style={{ backgroundColor: bg, color, fontSize: '0.78rem' }}>
      <i className={`fa-solid ${icono} me-1`}></i>
      {estado.charAt(0) + estado.slice(1).toLowerCase()}
    </span>
  );
};

const formatearFecha = (fechaISO) =>
  new Date(fechaISO).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

function AdminPedidos() {
  const [pedidos, setPedidos]               = useState([]);
  const [cargando, setCargando]             = useState(true);
  const [error, setError]                   = useState('');
  const [busqueda, setBusqueda]             = useState('');
  const [filtroEstado, setFiltroEstado]     = useState('');

  // Detalle expandido
  const [pedidoDetalle, setPedidoDetalle]   = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // Modal cambio de estado
  const [modalEstado, setModalEstado]       = useState(null); // { pedido_id, estadoActual }
  const [nuevoEstado, setNuevoEstado]       = useState('');
  const [guardandoEstado, setGuardandoEstado] = useState(false);

  const cargarPedidos = async () => {
    setCargando(true);
    try {
      const res = await fetch('http://localhost:8080/api/pedidos');
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Ordenar por fecha descendente
      setPedidos(data.sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido)));
    } catch {
      setError('No se pudieron cargar los pedidos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarPedidos(); }, []);

  // Filtrado
  const pedidosFiltrados = pedidos.filter(p => {
    const coincideTexto  = String(p.pedido_id).includes(busqueda) ||
                           String(p.usuario_id).includes(busqueda);
    const coincideEstado = filtroEstado ? p.estado === filtroEstado : true;
    return coincideTexto && coincideEstado;
  });

  // Cargar/cerrar detalle con líneas
  const toggleDetalle = async (pedidoId) => {
    if (pedidoDetalle?.pedido_id === pedidoId) { setPedidoDetalle(null); return; }
    setCargandoDetalle(true);
    try {
      const res = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}`);
      if (!res.ok) throw new Error();
      setPedidoDetalle(await res.json());
    } catch {
      setError('No se pudo cargar el detalle del pedido.');
    } finally {
      setCargandoDetalle(false);
    }
  };

  // Abrir modal cambio estado
  const abrirModalEstado = (pedido) => {
    setModalEstado({ pedido_id: pedido.pedido_id, estadoActual: pedido.estado });
    setNuevoEstado(pedido.estado);
  };

  // Guardar nuevo estado
  const handleGuardarEstado = async () => {
    if (nuevoEstado === modalEstado.estadoActual) { setModalEstado(null); return; }
    setGuardandoEstado(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/pedidos/${modalEstado.pedido_id}/estado?nuevoEstado=${nuevoEstado}`,
        { method: 'PATCH' }
      );
      if (!res.ok) throw new Error();
      setModalEstado(null);
      await cargarPedidos();
      // Si el detalle expandido es este pedido, recargarlo
      if (pedidoDetalle?.pedido_id === modalEstado.pedido_id) {
        const res2 = await fetch(`http://localhost:8080/api/pedidos/${modalEstado.pedido_id}`);
        setPedidoDetalle(await res2.json());
      }
    } catch {
      setError('No se pudo actualizar el estado del pedido.');
    } finally {
      setGuardandoEstado(false);
    }
  };

  // Estadísticas rápidas
  const stats = {
    total:     pedidos.length,
    pendiente: pedidos.filter(p => p.estado === 'PENDIENTE').length,
    enviado:   pedidos.filter(p => p.estado === 'ENVIADO').length,
    entregado: pedidos.filter(p => p.estado === 'ENTREGADO').length,
  };

  return (
    <div>
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 className="logo-text fw-bold mb-1" style={{ fontSize: '2rem' }}>
            <i className="fa-solid fa-truck text-accent me-2"></i> Gestión de Pedidos
          </h2>
          <p className="text-muted small mb-0">{pedidos.length} pedidos en total</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2 mb-4">
          <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
          <span>{error}</span>
          <button className="btn-close ms-auto btn-sm" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Tarjetas de estadísticas */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total pedidos', valor: stats.total,     bg: '#f8f5f0', color: 'var(--accent-color, #c9a87c)', icono: 'fa-list' },
          { label: 'Pendientes',    valor: stats.pendiente, bg: '#fff9e6', color: '#856404', icono: 'fa-clock' },
          { label: 'En camino',     valor: stats.enviado,   bg: '#e8f4fd', color: '#004085', icono: 'fa-truck' },
          { label: 'Entregados',    valor: stats.entregado, bg: '#eafaf1', color: '#155724', icono: 'fa-circle-check' },
        ].map(({ label, valor, bg, color, icono }) => (
          <div key={label} className="col-6 col-md-3">
            <div className="card-premium p-3 d-flex align-items-center gap-3"
              style={{ backgroundColor: bg }}>
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.6)' }}>
                <i className={`fa-solid ${icono}`} style={{ color }}></i>
              </div>
              <div>
                <p className="logo-text fw-bold mb-0" style={{ fontSize: '1.5rem', color }}>{valor}</p>
                <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="card-premium p-3 mb-4 d-flex flex-wrap gap-3 align-items-center">
        <div className="flex-grow-1 position-relative" style={{ minWidth: '200px' }}>
          <i className="fa-solid fa-magnifying-glass position-absolute text-muted"
            style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
          <input type="text" className="form-control rounded-3 ps-5"
            placeholder="Buscar por nº pedido o usuario..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <select className="form-select rounded-3" style={{ width: 'auto', minWidth: '160px' }}
          value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map(e => <option key={e} value={e}>{e.charAt(0) + e.slice(1).toLowerCase()}</option>)}
        </select>
        {(busqueda || filtroEstado) && (
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={() => { setBusqueda(''); setFiltroEstado(''); }}>
            <i className="fa-solid fa-xmark me-1"></i> Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="card-premium overflow-hidden">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-accent" role="status"
              style={{ width: '2.5rem', height: '2.5rem' }}></div>
            <p className="text-muted mt-3">Cargando pedidos...</p>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="fa-solid fa-truck fa-3x mb-3 opacity-25"></i>
            <p>No se encontraron pedidos.</p>
          </div>
        ) : (
          <table className="table mb-0 align-middle">
            <thead style={{ backgroundColor: '#f8f5f0' }}>
              <tr>
                {['Nº Pedido', 'Cliente', 'Fecha', 'Total', 'Estado', 'Acciones'].map(col => (
                  <th key={col}
                    className="py-3 px-4 fw-semibold text-muted small text-uppercase"
                    style={{ letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map(pedido => {
                const expandido = pedidoDetalle?.pedido_id === pedido.pedido_id;
                return (
                  <>
                    {/* Fila principal */}
                    <tr key={pedido.pedido_id}
                      style={{ borderBottom: '1px solid var(--border-color, #f0ebe3)' }}>

                      {/* Nº Pedido */}
                      <td className="py-3 px-4">
                        <span className="fw-bold logo-text" style={{ fontSize: '0.95rem' }}>
                          #{String(pedido.pedido_id).padStart(7, '0')}
                        </span>
                      </td>

                      {/* Cliente — mostramos usuario_id hasta tener endpoint de usuario */}
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                              width: '30px', height: '30px',
                              backgroundColor: 'var(--accent-color, #c9a87c)',
                              color: 'white', fontSize: '0.7rem', fontWeight: 700,
                            }}>
                            U{pedido.usuario_id}
                          </div>
                          <span className="text-muted small">Usuario #{pedido.usuario_id}</span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="py-3 px-4 text-muted small">
                        {formatearFecha(pedido.fechaPedido)}
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 fw-bold text-accent">
                        {pedido.precioTotal} {pedido.moneda === 'EUR' ? '€' : pedido.moneda}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-4">
                        <EstadoBadge estado={pedido.estado} />
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4">
                        <div className="d-flex gap-2 align-items-center">
                          {/* Ver detalles */}
                          <button
                            className="btn btn-sm rounded-3 d-flex align-items-center gap-1"
                            style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', border: 'none', fontSize: '0.8rem' }}
                            onClick={() => toggleDetalle(pedido.pedido_id)}
                            title="Ver detalles">
                            <i className={`fa-solid ${expandido ? 'fa-eye-slash' : 'fa-eye'} fa-xs`}></i>
                            <span className="d-none d-xl-inline">
                              {expandido ? 'Ocultar' : 'Detalles'}
                            </span>
                          </button>

                          {/* Cambiar estado */}
                          {pedido.estado !== 'ENTREGADO' && pedido.estado !== 'CANCELADO' && (
                            <button
                              className="btn btn-sm rounded-3 d-flex align-items-center gap-1"
                              style={{ backgroundColor: '#fff3cd', color: '#856404', border: 'none', fontSize: '0.8rem' }}
                              onClick={() => abrirModalEstado(pedido)}
                              title="Actualizar estado">
                              <i className="fa-solid fa-pen-to-square fa-xs"></i>
                              <span className="d-none d-xl-inline">Estado</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Fila de detalle expandible */}
                    {expandido && (
                      <tr key={`detalle-${pedido.pedido_id}`}
                        style={{ backgroundColor: '#faf8f5' }}>
                        <td colSpan={6} className="px-4 py-3">
                          {cargandoDetalle ? (
                            <div className="text-center py-2">
                              <div className="spinner-border spinner-border-sm text-accent" role="status"></div>
                              <span className="text-muted ms-2 small">Cargando artículos...</span>
                            </div>
                          ) : (
                            <div>
                              <p className="text-muted small fw-semibold text-uppercase mb-2"
                                style={{ letterSpacing: '0.5px' }}>
                                Artículos del pedido
                              </p>
                              <div className="d-flex flex-column gap-2">
                                {pedidoDetalle?.lineas?.map(linea => (
                                  <div key={linea.linea_id}
                                    className="d-flex align-items-center justify-content-between py-2 px-3 rounded-3"
                                    style={{ backgroundColor: 'white', border: '1px solid var(--border-color, #f0ebe3)' }}>
                                    <div className="d-flex align-items-center gap-3">
                                      <span className="fw-semibold text-dark small">{linea.tituloProducto}</span>
                                      <span className="badge rounded-pill"
                                        style={{ backgroundColor: '#f0ebe3', color: '#6c757d', fontSize: '0.7rem' }}>
                                        x{linea.cantidad}
                                      </span>
                                    </div>
                                    <span className="fw-bold text-accent small">
                                      {(linea.precioUnitario * linea.cantidad).toFixed(2)}{' '}
                                      {linea.moneda === 'EUR' ? '€' : linea.moneda}
                                    </span>
                                  </div>
                                ))}
                              </div>
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
        )}
      </div>

      {/* ══════════════════════════════════
          MODAL CAMBIO DE ESTADO
      ══════════════════════════════════ */}
      {modalEstado && (
        <>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1040,
            backgroundColor: 'rgba(44, 42, 41, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }} onClick={() => setModalEstado(null)} />

          <div style={{
            position: 'fixed', inset: 0, zIndex: 1050,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}>
            <div className="bg-white rounded-4 shadow-lg p-4"
              style={{ width: '100%', maxWidth: '440px' }}
              onClick={e => e.stopPropagation()}>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="logo-text fw-bold mb-0 fs-5">
                  <i className="fa-solid fa-pen-to-square text-accent me-2"></i>
                  Actualizar estado
                </h5>
                <button className="btn-close" onClick={() => setModalEstado(null)}></button>
              </div>

              <p className="text-muted small mb-1">
                Pedido <strong>#{String(modalEstado.pedido_id).padStart(7, '0')}</strong>
              </p>
              <p className="text-muted small mb-3">
                Estado actual: <EstadoBadge estado={modalEstado.estadoActual} />
              </p>

              {/* Selector visual de estados */}
              <div className="d-flex flex-column gap-2 mb-4">
                {ESTADOS.filter(e => e !== 'CANCELADO').map(estado => {
                  const { bg, color, icono } = ESTADO_CONFIG[estado];
                  const seleccionado = nuevoEstado === estado;
                  return (
                    <button key={estado} type="button"
                      className="btn d-flex align-items-center gap-3 rounded-3 text-start"
                      style={{
                        backgroundColor: seleccionado ? bg : 'white',
                        border: `2px solid ${seleccionado ? color : '#dee2e6'}`,
                        color: seleccionado ? color : '#6c757d',
                        transition: '0.15s',
                        padding: '0.6rem 1rem',
                      }}
                      onClick={() => setNuevoEstado(estado)}>
                      <i className={`fa-solid ${icono} fa-sm`} style={{ color }}></i>
                      <span className="fw-medium small">
                        {estado.charAt(0) + estado.slice(1).toLowerCase()}
                      </span>
                      {seleccionado && (
                        <i className="fa-solid fa-circle-check ms-auto" style={{ color }}></i>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="d-flex gap-3 justify-content-end">
                <button className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setModalEstado(null)}>
                  Cancelar
                </button>
                <button
                  className="btn btn-primary-accent rounded-pill px-4 d-flex align-items-center gap-2"
                  onClick={handleGuardarEstado}
                  disabled={guardandoEstado || nuevoEstado === modalEstado.estadoActual}>
                  {guardandoEstado
                    ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Guardando...</>
                    : <><i className="fa-solid fa-floppy-disk"></i> Guardar</>}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPedidos;