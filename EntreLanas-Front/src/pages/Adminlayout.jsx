import { useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function AdminLayout() {
  const { user, logout } = useAuth();
  const { setCarrito } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Protección de ruta: solo ROLE_ADMIN
  useEffect(() => {
    if (!user || user.rol !== 'ROLE_ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    setCarrito([]);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  if (!user || user.rol !== 'ROLE_ADMIN') return null;

  const navItems = [
    { path: '/admin',           label: 'Inicio',    icono: 'fa-house' },
    { path: '/admin/productos', label: 'Productos', icono: 'fa-box' },
    { path: '/admin/pedidos',   label: 'Pedidos',   icono: 'fa-truck' },
    { path: '/admin/usuarios',  label: 'Usuarios',  icono: 'fa-users' },
  ];

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: 'var(--bg-soft, #faf7f2)' }}>

      {/* ── Sidebar ── */}
      <aside
        className="d-flex flex-column py-4 px-3"
        style={{
          width: '220px',
          minWidth: '220px',
          backgroundColor: 'rgba(253, 251, 247, 0.97)',
          borderRight: '1px solid var(--border-color, #f0ebe3)',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Logo */}
        <Link to="/" className="text-decoration-none mb-5 px-2">
          <span className="logo-text fs-4 text-dark d-flex align-items-center gap-2">
            <i className="fa-solid fa-cookie-bite text-accent"></i> EntreLanas
          </span>
          <span className="text-muted small ms-4 ps-1">Panel Admin</span>
        </Link>

        {/* Navegación */}
        <nav className="d-flex flex-column gap-1 flex-grow-1">
          {navItems.map(({ path, label, icono }) => (
            <Link
              key={path}
              to={path}
              className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none fw-medium
                ${isActive(path)
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-dark nav-link-hover'}`}
              style={{ transition: '0.2s' }}
            >
              <i className={`fa-solid ${icono} fa-sm`}
                style={{ color: isActive(path) ? 'white' : 'var(--accent-color, #c9a87c)' }}></i>
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="border-top pt-3 mt-3" style={{ borderColor: 'var(--border-color, #f0ebe3)' }}>
          <p className="text-muted small px-2 mb-2">
            <i className="fa-solid fa-circle-user text-accent me-1"></i>
            {user.nombre} {user.apellidos}
          </p>
          <button
            onClick={handleLogout}
            className="btn btn-sm w-100 rounded-3 d-flex align-items-center gap-2 text-muted"
            style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color, #f0ebe3)' }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket fa-sm text-accent"></i> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="flex-grow-1 p-4 p-lg-5 overflow-auto">

        {/* Topbar */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div></div>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Hola,</span>
            <span className="fw-bold text-dark">{user.nombre}</span>
            <span className="badge rounded-pill px-2 py-1 ms-1"
              style={{ backgroundColor: '#d4edda', color: '#155724', fontSize: '0.7rem' }}>
              Admin
            </span>
          </div>
        </div>

        {/* Aquí se renderizan las páginas hijas */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;