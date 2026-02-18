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
    if (texto.trim() !== '') {
      navigate(`/productos?q=${texto}`);
    } else {
      navigate(`/`);
    }
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/">
          🧶 EntreLanas
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          
          <form className="d-flex mx-auto my-2 my-lg-0 px-3" style={{ maxWidth: "400px", width: "100%" }} onSubmit={(e) => e.preventDefault()}>
            <input 
              className="form-control form-control-sm border-0 shadow-none rounded-pill px-3" 
              type="search" 
              placeholder="🔍 Buscar lana, muñeco..." 
              value={busqueda}
              onChange={(e) => handleBuscar(e.target.value)}
            />
          </form>

          <ul className="navbar-nav ms-auto align-items-center">
            
            {/* MENÚ DESPLEGABLE */}
            <li className="nav-item dropdown me-3">
              <a className="nav-link dropdown-toggle text-white fw-bold" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Catálogo
              </a>
              <ul className="dropdown-menu shadow border-0 mt-2" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item fw-bold text-primary" to="/productos?categoria=ROPA">👗 Ropa</Link></li>
                <li><Link className="dropdown-item fw-bold text-primary" to="/productos?categoria=MATERIAL">🧶 Material</Link></li>
                <li><Link className="dropdown-item fw-bold text-primary" to="/productos?categoria=AMIGURUMI">🧸 Amigurumis</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/productos">Ver todo el catálogo</Link></li>
              </ul>
            </li>

            {!esPaginaAuth && (
              <li className="nav-item me-4">
                <Link to="/carrito" className="btn btn-light position-relative text-primary fw-bold btn-sm" onClick={handleCartClick}>
                  🛒 Carrito
                  {cantidadTotal > 0 && user && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cantidadTotal}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li className="nav-item border-start ps-3 border-white border-opacity-25">
                  <span className="text-white fw-light me-3">Hola, {user.nombre}</span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-light btn-sm fw-bold">Salir</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item border-start ps-3 border-white border-opacity-25">
                  <Link className="btn btn-outline-light btn-sm me-2" to="/login">Entrar</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light text-primary btn-sm fw-bold" to="/registro">Registrarse</Link>
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