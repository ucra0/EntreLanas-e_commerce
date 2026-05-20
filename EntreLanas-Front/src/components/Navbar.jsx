import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavoritos } from '../context/FavoritosContext';

function Navbar() {
  const { user, logout }              = useAuth();
  const { cantidadTotal, setCarrito } = useCart();
  const { cantidadFavoritos }         = useFavoritos();
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

          {/* Barra de búsqueda — ancho controlado para no empujar los items */}
          <form
            className="d-flex mx-auto my-3 my-lg-0 search-bar-custom"
            style={{ maxWidth: '260px', width: '100%' }}
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

          {/* Items de navegación */}
          <ul className="navbar-nav ms-auto align-items-center fw-medium text-dark gap-2">

            {/* CATÁLOGO */}
            <li className="nav-item dropdown">
              <a
                className="nav-link text-dark dropdown-toggle no-arrow nav-link-hover px-2"
                href="#"
                data-bs-toggle="dropdown"
                style={{ fontSize: '0.95rem' }}
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
                  className="nav-link text-dark nav-link-hover d-flex align-items-center px-2"
                  style={{ fontSize: '0.95rem' }}
                  onClick={handleCartClick}
                >
                  <i className="fa-solid fa-cart-shopping text-accent me-1"></i> Carrito
                  {cantidadTotal > 0 && user && (
                    <span className="badge rounded-pill bg-accent shadow-sm ms-1"
                      style={{ fontSize: '0.68rem' }}>
                      {cantidadTotal}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {/* ── USUARIO LOGUEADO ── */}
            {user ? (
              <>
                {/* Mis pedidos */}
                <li className="nav-item">
                  <Link
                    className="nav-link text-dark nav-link-hover d-flex align-items-center px-2"
                    to="/mis-pedidos"
                    style={{ fontSize: '0.95rem' }}
                  >
                    <i className="fa-solid fa-box-open text-accent me-1"></i> Mis pedidos
                  </Link>
                </li>

                {/* Favoritos */}
                <li className="nav-item">
                  <Link
                    className="nav-link text-dark nav-link-hover d-flex align-items-center px-2"
                    to="/mis-favoritos"
                    style={{ fontSize: '0.95rem' }}
                  >
                    <i className="fa-solid fa-heart text-accent me-1"></i> Favoritos
                    {cantidadFavoritos > 0 && (
                      <span className="badge rounded-pill bg-accent shadow-sm ms-1"
                        style={{ fontSize: '0.68rem' }}>
                        {cantidadFavoritos}
                      </span>
                    )}
                  </Link>
                </li>

                {/* Separador */}
                <li
                  className="nav-item d-none d-lg-block border-start mx-1"
                  style={{ height: '20px', borderColor: 'var(--border-color)' }}
                ></li>

                {/* Saludo */}
                <li className="nav-item d-flex align-items-center px-1">
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                    Hola, {user.nombre}
                  </span>
                </li>

                {/* Botón Salir */}
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-primary-accent btn-blanco-hover rounded-pill px-3 shadow-sm d-flex align-items-center"
                    style={{ fontSize: '0.875rem' }}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket me-2"></i> Salir
                  </button>
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
                  <Link
                    className="nav-link text-dark nav-link-hover"
                    to="/login"
                    style={{ fontSize: '0.95rem' }}
                  >
                    Entrar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn bg-accent rounded-pill px-4 ms-2 shadow-sm nav-link-hover text-white"
                    to="/registro"
                    style={{ fontSize: '0.875rem' }}
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