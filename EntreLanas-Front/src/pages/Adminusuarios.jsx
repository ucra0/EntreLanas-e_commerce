import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ROL_CONFIG = {
  ROLE_ADMIN: { bg: '#d4edda', color: '#155724', label: 'Admin',   icono: 'fa-shield-halved' },
  ROLE_USER:  { bg: '#e3f2fd', color: '#0d47a1', label: 'Cliente', icono: 'fa-user' },
};

const RolBadge = ({ rol }) => {
  const { bg, color, label, icono } = ROL_CONFIG[rol] ?? { bg: '#f5f5f5', color: '#333', label: rol, icono: 'fa-question' };
  return (
    <span className="badge rounded-pill px-3 py-2 fw-semibold"
      style={{ backgroundColor: bg, color, fontSize: '0.78rem' }}>
      <i className={`fa-solid ${icono} me-1`}></i>{label}
    </span>
  );
};

// Genera iniciales para el avatar
const iniciales = (nombre, apellidos) =>
  `${nombre?.charAt(0) ?? ''}${apellidos?.charAt(0) ?? ''}`.toUpperCase();

// Color de avatar determinista según id
const colorAvatar = (id) => {
  const colores = ['#c9a87c', '#7cad8f', '#c97c9a', '#7c9ac9', '#a87cc9'];
  return colores[id % colores.length];
};

function AdminUsuarios() {
  const { user: adminActual } = useAuth();

  const [usuarios, setUsuarios]           = useState([]);
  const [cargando, setCargando]           = useState(true);
  const [error, setError]                 = useState('');
  const [busqueda, setBusqueda]           = useState('');
  const [filtroRol, setFiltroRol]         = useState('');

  // Modal cambio de rol
  const [modalRol, setModalRol]           = useState(null); // { usuario_id, rolActual, nombre }
  const [nuevoRol, setNuevoRol]           = useState('');
  const [guardandoRol, setGuardandoRol]   = useState(false);

  // Modal confirmación eliminar
  const [confirmando, setConfirmando]     = useState(null); // { usuario_id, nombre }

  // Panel de pedidos del usuario
  const [pedidosUsuario, setPedidosUsuario] = useState(null); // { usuario_id, pedidos[] }
  const [cargandoPedidos, setCargandoPedidos] = useState(false);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const res = await fetch('http://localhost:8080/api/usuarios');
      if (!res.ok) throw new Error();
      setUsuarios(await res.json());
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const usuariosFiltrados = usuarios.filter(u => {
    const texto = `${u.username} ${u.nombre} ${u.apellidos} ${u.email}`
      .toLowerCase().includes(busqueda.toLowerCase());
    const rol   = filtroRol ? u.rol === filtroRol : true;
    return texto && rol;
  });

  // ── Cambiar rol ──
  const abrirModalRol = (u) => {
    setModalRol({ usuario_id: u.usuario_id, rolActual: u.rol, nombre: u.nombre });
    setNuevoRol(u.rol);
  };

  const handleGuardarRol = async () => {
    if (nuevoRol === modalRol.rolActual) { setModalRol(null); return; }
    setGuardandoRol(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/usuarios/${modalRol.usuario_id}/rol?nuevoRol=${nuevoRol}`,
        { method: 'PATCH' }
      );
      if (!res.ok) throw new Error();
      setModalRol(null);
      await cargarUsuarios();
    } catch {
      setError('No se pudo actualizar el rol del usuario.');
    } finally {
      setGuardandoRol(false);
    }
  };

  // ── Eliminar usuario ──
  const handleEliminar = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/usuarios/${confirmando.usuario_id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error();
      setConfirmando(null);
      await cargarUsuarios();
    } catch {
      setError('No se pudo eliminar el usuario.');
    }
  };

  // ── Ver pedidos del usuario ──
  const togglePedidos = async (usuario_id) => {
    if (pedidosUsuario?.usuario_id === usuario_id) { setPedidosUsuario(null); return; }
    setCargandoPedidos(true);
    try {
      const res = await fetch(`http://localhost:8080/api/pedidos/usuario/${usuario_id}`);
      if (!res.ok) throw new Error();
      const pedidos = await res.json();
      setPedidosUsuario({ usuario_id, pedidos });
    } catch {
      setError('No se pudieron cargar los pedidos del usuario.');
    } finally {
      setCargandoPedidos(false);
    }
  };

  // Estadísticas rápidas
  const stats = {
    total:   usuarios.length,
    clientes: usuarios.filter(u => u.rol === 'ROLE_USER').length,
    admins:   usuarios.filter(u => u.rol === 'ROLE_ADMIN').length,
  };

  return (
    <div>
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 className="logo-text fw-bold mb-1" style={{ fontSize: '2rem' }}>
            <i className="fa-solid fa-users text-accent me-2"></i> Gestión de Usuarios
          </h2>
          <p className="text-muted small mb-0">{usuarios.length} usuarios registrados</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2 mb-4">
          <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
          <span>{error}</span>
          <button className="btn-close ms-auto btn-sm" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Estadísticas */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total usuarios', valor: stats.total,    bg: '#f8f5f0', color: 'var(--accent-color, #c9a87c)', icono: 'fa-users' },
          { label: 'Clientes',       valor: stats.clientes, bg: '#e8f4fd', color: '#0d47a1',                      icono: 'fa-user' },
          { label: 'Administradores',valor: stats.admins,   bg: '#eafaf1', color: '#155724',                      icono: 'fa-shield-halved' },
        ].map(({ label, valor, bg, color, icono }) => (
          <div key={label} className="col-6 col-md-4">
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
            placeholder="Buscar por nombre, usuario o email..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <select className="form-select rounded-3" style={{ width: 'auto', minWidth: '160px' }}
          value={filtroRol} onChange={e => setFiltroRol(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="ROLE_USER">Clientes</option>
          <option value="ROLE_ADMIN">Administradores</option>
        </select>
        {(busqueda || filtroRol) && (
          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={() => { setBusqueda(''); setFiltroRol(''); }}>
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
            <p className="text-muted mt-3">Cargando usuarios...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="fa-solid fa-users fa-3x mb-3 opacity-25"></i>
            <p>No se encontraron usuarios.</p>
          </div>
        ) : (
          <table className="table mb-0 align-middle">
            <thead style={{ backgroundColor: '#f8f5f0' }}>
              <tr>
                {['Usuario', 'Nombre completo', 'Email', 'Rol', 'Pedidos', 'Acciones'].map(col => (
                  <th key={col}
                    className="py-3 px-4 fw-semibold text-muted small text-uppercase"
                    style={{ letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(u => {
                const expandido = pedidosUsuario?.usuario_id === u.usuario_id;
                const esSelf    = u.usuario_id === adminActual?.usuario_id;

                return (
                  <>
                    <tr key={u.usuario_id}
                      style={{ borderBottom: '1px solid var(--border-color, #f0ebe3)' }}>

                      {/* Avatar + username */}
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
                            style={{
                              width: '38px', height: '38px',
                              backgroundColor: colorAvatar(u.usuario_id),
                              fontSize: '0.8rem',
                            }}>
                            {iniciales(u.nombre, u.apellidos)}
                          </div>
                          <div>
                            <p className="fw-semibold text-dark mb-0 small">@{u.username}</p>
                            {esSelf && (
                              <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                (tú)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Nombre completo */}
                      <td className="py-3 px-4 text-dark small">
                        {u.nombre} {u.apellidos}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-muted small">{u.email}</td>

                      {/* Rol */}
                      <td className="py-3 px-4">
                        <RolBadge rol={u.rol} />
                      </td>

                      {/* Pedidos */}
                      <td className="py-3 px-4">
                        <button
                          className="btn btn-sm rounded-3 d-flex align-items-center gap-1"
                          style={{ backgroundColor: '#f8f5f0', color: '#6c757d', border: 'none', fontSize: '0.8rem' }}
                          onClick={() => togglePedidos(u.usuario_id)}>
                          <i className={`fa-solid ${expandido ? 'fa-chevron-up' : 'fa-box'} fa-xs`}></i>
                          <span>{expandido ? 'Ocultar' : 'Ver pedidos'}</span>
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4">
                        <div className="d-flex gap-2">
                          {/* Cambiar rol — no se puede cambiar el propio rol */}
                          <button
                            className="btn btn-sm rounded-3"
                            style={{ backgroundColor: '#fff3cd', color: '#856404', border: 'none' }}
                            onClick={() => abrirModalRol(u)}
                            title="Cambiar rol"
                            disabled={esSelf}>
                            <i className="fa-solid fa-shield-halved fa-xs"></i>
                          </button>

                          {/* Eliminar — no se puede eliminar a uno mismo */}
                          <button
                            className="btn btn-sm rounded-3"
                            style={{
                                backgroundColor: (esSelf || u.numeroPedidos > 0) ? '#f5f5f5' : '#fce4ec',
                                color: (esSelf || u.numeroPedidos > 0) ? '#aaa' : '#880e4f',
                                border: 'none',
                            }}
                            onClick={() => setConfirmando({ usuario_id: u.usuario_id, nombre: u.nombre })}
                            title={
                                esSelf ? 'No puedes eliminarte a ti mismo'
                                : u.numeroPedidos > 0 ? `No se puede eliminar: tiene ${u.numeroPedidos} pedido(s)`
                                : 'Eliminar usuario'
                            }
                                disabled={esSelf || u.numeroPedidos > 0}>
                                <i className="fa-solid fa-trash fa-xs"></i>
                            </button>
                        </div>
                      </td>
                    </tr>

                    {/* Fila expandible — pedidos del usuario */}
                    {expandido && (
                      <tr key={`pedidos-${u.usuario_id}`}
                        style={{ backgroundColor: '#faf8f5' }}>
                        <td colSpan={6} className="px-4 py-3">
                          {cargandoPedidos ? (
                            <div className="text-center py-2">
                              <div className="spinner-border spinner-border-sm text-accent" role="status"></div>
                              <span className="text-muted ms-2 small">Cargando pedidos...</span>
                            </div>
                          ) : pedidosUsuario.pedidos.length === 0 ? (
                            <p className="text-muted small mb-0">
                              <i className="fa-solid fa-box-open me-2 opacity-50"></i>
                              Este usuario no tiene pedidos realizados.
                            </p>
                          ) : (
                            <div>
                              <p className="text-muted small fw-semibold text-uppercase mb-2"
                                style={{ letterSpacing: '0.5px' }}>
                                {pedidosUsuario.pedidos.length} pedido(s)
                              </p>
                              <div className="d-flex flex-column gap-2">
                                {pedidosUsuario.pedidos.map(p => (
                                  <div key={p.pedido_id}
                                    className="d-flex align-items-center justify-content-between py-2 px-3 rounded-3"
                                    style={{ backgroundColor: 'white', border: '1px solid var(--border-color, #f0ebe3)' }}>
                                    <span className="fw-semibold text-dark small">
                                      #{String(p.pedido_id).padStart(7, '0')}
                                    </span>
                                    <span className="text-muted small">
                                      {new Date(p.fechaPedido).toLocaleDateString('es-ES')}
                                    </span>
                                    <span className="badge rounded-pill px-2 py-1 small fw-semibold"
                                      style={{
                                        backgroundColor: (p.estado === 'ENTREGADO' ? '#d4edda' : p.estado === 'CANCELADO' ? '#f8d7da' : '#fff3cd'),
                                        color: (p.estado === 'ENTREGADO' ? '#155724' : p.estado === 'CANCELADO' ? '#721c24' : '#856404'),
                                        fontSize: '0.7rem',
                                      }}>
                                      {p.estado}
                                    </span>
                                    <span className="fw-bold text-accent small">
                                      {p.precioTotal} {p.moneda === 'EUR' ? '€' : p.moneda}
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

      {/* ══ MODAL CAMBIO DE ROL ══ */}
      {modalRol && (
        <>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1040,
            backgroundColor: 'rgba(44, 42, 41, 0.45)',
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          }} onClick={() => setModalRol(null)} />
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1050,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}>
            <div className="bg-white rounded-4 shadow-lg p-4"
              style={{ width: '100%', maxWidth: '400px' }}
              onClick={e => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="logo-text fw-bold mb-0 fs-5">
                  <i className="fa-solid fa-shield-halved text-accent me-2"></i>
                  Cambiar rol
                </h5>
                <button className="btn-close" onClick={() => setModalRol(null)}></button>
              </div>
              <p className="text-muted small mb-3">
                Usuario: <strong>{modalRol.nombre}</strong><br />
                Rol actual: <RolBadge rol={modalRol.rolActual} />
              </p>
              <div className="d-flex flex-column gap-2 mb-4">
                {['ROLE_USER', 'ROLE_ADMIN'].map(rol => {
                  const { bg, color, label, icono } = ROL_CONFIG[rol];
                  const sel = nuevoRol === rol;
                  return (
                    <button key={rol} type="button"
                      className="btn d-flex align-items-center gap-3 rounded-3 text-start"
                      style={{
                        backgroundColor: sel ? bg : 'white',
                        border: `2px solid ${sel ? color : '#dee2e6'}`,
                        color: sel ? color : '#6c757d',
                        transition: '0.15s', padding: '0.6rem 1rem',
                      }}
                      onClick={() => setNuevoRol(rol)}>
                      <i className={`fa-solid ${icono} fa-sm`} style={{ color }}></i>
                      <span className="fw-medium small">{label}</span>
                      {sel && <i className="fa-solid fa-circle-check ms-auto" style={{ color }}></i>}
                    </button>
                  );
                })}
              </div>
              <div className="d-flex gap-3 justify-content-end">
                <button className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setModalRol(null)}>Cancelar</button>
                <button className="btn btn-primary-accent rounded-pill px-4 d-flex align-items-center gap-2"
                  onClick={handleGuardarRol}
                  disabled={guardandoRol || nuevoRol === modalRol.rolActual}>
                  {guardandoRol
                    ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Guardando...</>
                    : <><i className="fa-solid fa-floppy-disk"></i> Guardar</>}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══ MODAL CONFIRMAR ELIMINAR ══ */}
      {confirmando && (
        <>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1040,
            backgroundColor: 'rgba(44, 42, 41, 0.45)',
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          }} onClick={() => setConfirmando(null)} />
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1050,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}>
            <div className="bg-white rounded-4 shadow-lg text-center p-4"
              style={{ maxWidth: '420px', width: '100%' }}
              onClick={e => e.stopPropagation()}>
              <i className="fa-solid fa-triangle-exclamation text-warning fa-3x mb-3"></i>
              <h5 className="logo-text fw-bold mb-2">¿Eliminar usuario?</h5>
              <p className="text-muted mb-1">
                Vas a eliminar a <strong>{confirmando.nombre}</strong>.
              </p>
              <p className="text-muted small mb-4">
                Se eliminarán también todos sus pedidos asociados. Esta acción no se puede deshacer.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <button className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setConfirmando(null)}>Cancelar</button>
                <button className="btn rounded-pill px-4"
                  style={{ backgroundColor: '#f8d7da', color: '#721c24', border: 'none' }}
                  onClick={handleEliminar}>
                  <i className="fa-solid fa-trash me-2"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminUsuarios;