import { useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function AdminLayout() {
  const { user, logout } = useAuth();
  const { setCarrito } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Protección: solo ROLE_ADMIN
  useEffect(() => {
    if (!user || user.rol !== 'ROLE_ADMIN') navigate('/');
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    setCarrito([]);
    navigate('/');
  };

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);

  if (!user || user.rol !== 'ROLE_ADMIN') return null;

  const navItems = [
    { path: '/admin',           label: 'Inicio',    icono: 'fa-house' },
    { path: '/admin/productos', label: 'Productos', icono: 'fa-box' },
    { path: '/admin/pedidos',   label: 'Pedidos',   icono: 'fa-truck' },
    { path: '/admin/usuarios',  label: 'Usuarios',  icono: 'fa-users' },
  ];

  return (
    // Ocupamos exactamente el viewport: sin Navbar encima
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside
        className="d-flex flex-column flex-shrink-0"
        style={{
          width: '220px',
          height: '100vh',
          backgroundColor: 'rgba(253, 251, 247, 0.98)',
          borderRight: '1px solid var(--border-color, #f0ebe3)',
          padding: '1.5rem 0.75rem',
          // Distribuimos el espacio para que todo quepa sin scroll
          justifyContent: 'space-between',
        }}
      >
        {/* Bloque superior: logo + nav */}
        <div>
          {/* Logo */}
          <Link to="/admin" className="text-decoration-none d-block mb-4 px-2">
            <span className="logo-text fs-5 text-dark d-flex align-items-center gap-2">
              <i className="fa-solid fa-cookie-bite text-accent"></i> EntreLanas
            </span>
            <span className="text-muted ms-4 ps-1" style={{ fontSize: '0.72rem' }}>
              Panel Admin
            </span>
          </Link>

          {/* Navegación */}
          <nav className="d-flex flex-column gap-1">
            {navItems.map(({ path, label, icono }) => (
              <Link
                key={path}
                to={path}
                className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none fw-medium"
                style={{
                  transition: '0.2s',
                  backgroundColor: isActive(path) ? 'var(--accent-color, #c9a87c)' : 'transparent',
                  color: isActive(path) ? 'white' : '#2c2a29',
                  fontSize: '0.9rem',
                }}
              >
                <i
                  className={`fa-solid ${icono} fa-sm`}
                  style={{ color: isActive(path) ? 'white' : 'var(--accent-color, #c9a87c)' }}
                ></i>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bloque inferior: usuario + cerrar sesión */}
        <div
          className="pt-3"
          style={{ borderTop: '1px solid var(--border-color, #f0ebe3)' }}
        >
          <div className="d-flex align-items-center gap-2 px-2 mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: '32px', height: '32px',
                backgroundColor: 'var(--accent-color, #c9a87c)',
                color: 'white', fontSize: '0.75rem', fontWeight: 700,
              }}
            >
              {user.nombre?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="mb-0 fw-semibold text-dark text-truncate"
                style={{ fontSize: '0.8rem' }}>
                {user.nombre} {user.apellidos}
              </p>
              <p className="mb-0 text-muted text-truncate" style={{ fontSize: '0.7rem' }}>
                Administrador
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-sm w-100 rounded-3 d-flex align-items-center gap-2 text-muted"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color, #f0ebe3)',
              fontSize: '0.82rem',
            }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket fa-sm text-accent"></i>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ══════════════ CONTENIDO ══════════════ */}
      <main
        className="flex-grow-1 overflow-auto"
        style={{ backgroundColor: 'var(--bg-soft, #faf7f2)', padding: '2.5rem 3rem' }}
      >
        {/* Topbar derecha */}
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Hola,</span>
            <span className="fw-bold text-dark small">{user.nombre}</span>
            <span
              className="badge rounded-pill px-2 py-1"
              style={{
                backgroundColor: '#d4edda', color: '#155724', fontSize: '0.65rem',
              }}
            >
              Admin
            </span>
          </div>
        </div>

        {/* Páginas hijas */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;