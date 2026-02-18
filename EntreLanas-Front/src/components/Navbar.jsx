import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cantidadTotal } = useCart();
  
  
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  
  const handleBuscar = (e) => {
    e.preventDefault();
    if(busqueda.trim() !== '') {
      navigate(`/productos?q=${busqueda}`); 
    } else {
      navigate(`/productos`);
    }
  };

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
          
          {/* BUSCADOR CENTRADO */}
          <form className="d-flex mx-auto my-2 my-lg-0 px-3" style={{ maxWidth: "400px", width: "100%" }} onSubmit={handleBuscar}>
            <input 
              className="form-control form-control-sm me-2 border-0 shadow-none" 
              type="search" 
              placeholder="Buscar lana, muñeco..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="btn btn-light btn-sm text-primary fw-bold" type="submit">
              🔍
            </button>
          </form>

          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item me-3">
              <Link className="nav-link text-white fw-bold" to="/productos">Catálogo</Link>
            </li>

            <li className="nav-item me-4">
              <Link to="/carrito" className="btn btn-light position-relative text-primary fw-bold btn-sm">
                🛒 Carrito
                {cantidadTotal > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cantidadTotal}
                  </span>
                )}
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item border-start ps-3 border-white border-opacity-25">
                  <span className="text-white fw-light me-3">Hola, {user.nombre}</span>
                </li>
                <li className="nav-item">
                  <button onClick={logout} className="btn btn-outline-light btn-sm fw-bold">Salir</button>
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