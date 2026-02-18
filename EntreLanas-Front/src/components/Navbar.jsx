import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cantidadTotal, setCarrito } = useCart();
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleBuscar = (texto) => {
    setBusqueda(texto);
    if (texto.trim() !== '') navigate(`/productos?q=${texto}`);
    else navigate(`/`);
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Debes iniciar sesión para poder usar el carrito de la compra.");
    }
  };

  const handleLogout = () => {
    logout();
    setCarrito([]);
    navigate('/');
  };

  const esPaginaAuth = location.pathname === '/login' || location.pathname === '/registro';

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: 'rgba(253, 251, 247, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-2">
        <Link className="navbar-brand logo-text fs-3 text-dark d-flex align-items-center gap-2" to="/">
          <i className="fa-solid fa-cookie-bite text-accent"></i> EntreLanas
        </Link>

        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <i className="fa-solid fa-bars fs-4 text-dark"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          
          <form className="d-flex mx-auto my-3 my-lg-0 search-bar-custom" onSubmit={(e) => e.preventDefault()}>
            <i className="fa-solid fa-magnifying-glass text-muted mt-1"></i>
            <input 
              className="ms-2" 
              type="search" 
              placeholder="Buscar lana, muñeco..." 
              value={busqueda}
              onChange={(e) => handleBuscar(e.target.value)}
            />
          </form>

          <ul className="navbar-nav ms-auto align-items-center fw-medium text-dark gap-3">
            
            {/* BOTÓN CATÁLOGO */}
            <li className="nav-item dropdown">
              <a className="nav-link text-dark dropdown-toggle no-arrow nav-link-hover px-3" href="#" data-bs-toggle="dropdown">
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

            {/* BOTÓN CARRITO (¡Ahora es idéntico al de catálogo!) */}
            {!esPaginaAuth && (
              <li className="nav-item">
                <Link to="/carrito" className="nav-link text-dark nav-link-hover d-flex align-items-center px-3" onClick={handleCartClick}>
                  <i className="fa-solid fa-cart-shopping text-accent me-2"></i> Carrito
                  {cantidadTotal > 0 && user && (
                    <span className="badge rounded-pill bg-accent shadow-sm ms-1">{cantidadTotal}</span>
                  )}
                </Link>
              </li>
            )}

            {/* SECCIÓN DE USUARIO / LOGIN */}
            {user ? (
              <>
                <li className="nav-item d-none d-lg-block border-start mx-2" style={{ height: '20px', borderColor: 'var(--border-color)' }}></li>
                <li className="nav-item d-flex align-items-center">
                  <span className="text-muted me-2">Hola, {user.nombre}</span>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-primary-accent btn-blanco-hover rounded-pill px-3 ms-2 shadow-sm d-flex align-items-center"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket me-2"></i> 
                      Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-none d-lg-block border-start mx-2" style={{ height: '20px', borderColor: 'var(--border-color)' }}></li>
                <li className="nav-item">
                  <Link className="nav-link text-dark nav-link-hover" to="/login">Entrar</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn bg-accent rounded-pill px-4 ms-2 shadow-sm nav-link-hover text-white" to="/registro">Registrarse</Link>
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