import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavoritos } from '../context/FavoritosContext';
import { useListaDeseos } from '../context/ListaDeseosContext';

function Navbar() {
  const { user, logout }              = useAuth();
  const { cantidadTotal, setCarrito } = useCart();
  const { cantidadFavoritos }         = useFavoritos();
  const { cantidadDeseos }            = useListaDeseos();
  const [busqueda, setBusqueda]       = useState('');
  const navigate                      = useNavigate();
  const location                      = useLocation();

  const handleBuscar = (texto) => {
    setBusqueda(texto);
    if (texto.trim() !== '') navigate(`/productos?q=${texto}`);
    else navigate('/');
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert('Debes iniciar sesión para poder usar el carrito de la compra.');
    }
  };

  const handleLogout = () => {
    logout();
    setCarrito([]);
    navigate('/');
  };

  const esPaginaAuth = location.pathname === '/login' || location.pathname === '/registro';

  // Total de items personales para el badge del dropdown
  const totalPersonal = cantidadFavoritos + cantidadDeseos;

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        backgroundColor: 'rgba(253, 251, 247, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="container py-2">

        {/* Logo */}
        <Link
          className="navbar-brand logo-text text-dark d-flex align-items-center gap-2"
          to="/"
          style={{ fontSize: '1.6rem' }}
        >
          <i className="fa-solid fa-cookie-bite text-accent"></i> EntreLanas
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <i className="fa-solid fa-bars text-dark"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          {/* Barra de búsqueda */}
          <form
            className="d-flex mx-auto my-3 my-lg-0 search-bar-custom"
            style={{ maxWidth: '280px', width: '100%' }}
            onSubmit={(e) => e.preventDefault()}
          >
            <i className="fa-solid fa-magnifying-glass text-muted mt-1"></i>
            <input
              className="ms-2"
              type="search"
              placeholder="Buscar lana, muñeco..."
              value={busqueda}
              onChange={(e) => handleBuscar(e.target.value)}
            />
          </form>

          <ul className="navbar-nav ms-auto align-items-center fw-medium text-dark gap-2">

            {/* CATÁLOGO */}
            <li className="nav-item dropdown">
              <a
                className="nav-link text-dark dropdown-toggle no-arrow nav-link-hover px-3"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i className="fa-solid fa-layer-group text-accent me-1"></i> Catálogo
              </a>
              <ul className="dropdown-menu shadow border-0 mt-2 border-radius-custom">
                <li><Link className="dropdown-item fw-bold nav-link-hover" to="/productos?categoria=ROPA">Ropa</Link></li>
                <li><Link className="dropdown-item fw-bold nav-link-hover" to="/productos?categoria=MATERIAL">Material</Link></li>
                <li><Link className="dropdown-item fw-bold nav-link-hover" to="/productos?categoria=AMIGURUMI">Amigurumis</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item nav-link-hover" to="/productos">Ver todo el catálogo</Link></li>
              </ul>
            </li>

            {/* CARRITO */}
            {!esPaginaAuth && (
              <li className="nav-item">
                <Link
                  to="/carrito"
                  className="nav-link text-dark nav-link-hover d-flex align-items-center px-3"
                  onClick={handleCartClick}
                >
                  <i className="fa-solid fa-cart-shopping text-accent me-2"></i> Carrito
                  {cantidadTotal > 0 && user && (
                    <span className="badge rounded-pill bg-accent shadow-sm ms-1">
                      {cantidadTotal}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {/* ── USUARIO LOGUEADO — dropdown ── */}
            {user ? (
              <>
                <li
                  className="nav-item d-none d-lg-block border-start mx-1"
                  style={{ height: '20px', borderColor: 'var(--border-color)' }}
                ></li>

                {/* Dropdown de cuenta */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link text-dark dropdown-toggle no-arrow nav-link-hover d-flex align-items-center gap-2 px-3"
                    href="#"
                    data-bs-toggle="dropdown"
                  >
                    {/* Avatar con inicial */}
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '28px', height: '28px',
                        backgroundColor: 'var(--accent-color, #c9a87c)',
                        color: 'white', fontSize: '0.72rem', fontWeight: 700,
                      }}
                    >
                      {user.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <span>Hola, {user.nombre}</span>
                    {/* Badge total si hay favoritos o deseos */}
                    {totalPersonal > 0 && (
                      <span className="badge rounded-pill bg-accent shadow-sm" style={{ fontSize: '0.65rem' }}>
                        {totalPersonal}
                      </span>
                    )}
                  </a>

                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2"
                    style={{ minWidth: '220px', borderRadius: '16px' }}>

                    {/* Cabecera del dropdown */}
                    <li className="px-3 pt-2 pb-1">
                      <p className="text-muted small mb-0">Cuenta de</p>
                      <p className="fw-bold text-dark mb-0">{user.nombre} {user.apellidos}</p>
                    </li>
                    <li><hr className="dropdown-divider my-2" /></li>

                    {/* Mis pedidos */}
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2 nav-link-hover"
                        to="/mis-pedidos">
                        <i className="fa-solid fa-box-open text-accent fa-sm" style={{ width: '16px' }}></i>
                        <span>Mis pedidos</span>
                      </Link>
                    </li>

                    {/* Favoritos */}
                    <li>
                      <Link className="dropdown-item d-flex align-items-center justify-content-between py-2 nav-link-hover"
                        to="/mis-favoritos">
                        <div className="d-flex align-items-center gap-2">
                          <i className="fa-solid fa-heart text-accent fa-sm" style={{ width: '16px' }}></i>
                          <span>Favoritos</span>
                        </div>
                        {cantidadFavoritos > 0 && (
                          <span className="badge rounded-pill bg-accent" style={{ fontSize: '0.65rem' }}>
                            {cantidadFavoritos}
                          </span>
                        )}
                      </Link>
                    </li>

                    {/* Lista de deseos */}
                    <li>
                      <Link className="dropdown-item d-flex align-items-center justify-content-between py-2 nav-link-hover"
                        to="/mis-deseos">
                        <div className="d-flex align-items-center gap-2">
                          <i className="fa-solid fa-star text-accent fa-sm" style={{ width: '16px' }}></i>
                          <span>Lista de deseos</span>
                        </div>
                        {cantidadDeseos > 0 && (
                          <span className="badge rounded-pill bg-accent" style={{ fontSize: '0.65rem' }}>
                            {cantidadDeseos}
                          </span>
                        )}
                      </Link>
                    </li>

                    <li><hr className="dropdown-divider my-2" /></li>

                    {/* Cerrar sesión */}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger nav-link-hover"
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket fa-sm" style={{ width: '16px' }}></i>
                        <span>Cerrar sesión</span>
                      </button>
                    </li>
                    <li className="pb-1"></li>
                  </ul>
                </li>
              </>
            ) : (
              /* ── USUARIO NO LOGUEADO ── */
              <>
                <li
                  className="nav-item d-none d-lg-block border-start mx-2"
                  style={{ height: '20px', borderColor: 'var(--border-color)' }}
                ></li>
                <li className="nav-item">
                  <Link className="nav-link text-dark nav-link-hover" to="/login">
                    Entrar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn bg-accent rounded-pill px-4 ms-2 shadow-sm nav-link-hover text-white"
                    to="/registro"
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;