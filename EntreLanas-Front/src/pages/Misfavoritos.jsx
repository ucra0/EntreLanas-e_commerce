import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavoritos } from '../context/FavoritosContext';

function MisFavoritos() {
  const { user }                        = useAuth();
  const { addToCart }                   = useCart();
  const { favoritos, eliminarFavorito } = useFavoritos();
  const navigate                        = useNavigate();
  const [showToast, setShowToast]       = useState(false);
  const [toastNombre, setToastNombre]   = useState('');

  const handleAddToCart = (fav) => {
    const producto = {
      id:        fav.producto_id,
      titulo:    fav.titulo,
      imagen:    fav.imagen,
      precio:    fav.precio,
      stock:     fav.stock,
      categoria: fav.categoria,
    };
    addToCart(producto);
    setToastNombre(fav.titulo);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Guardia: no logueado
  if (!user) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center card-premium p-5" style={{ maxWidth: '500px' }}>
          <i className="fa-solid fa-lock text-accent mb-4" style={{ fontSize: '4rem' }}></i>
          <h2 className="logo-text mb-3">Acceso Restringido</h2>
          <p className="text-muted mb-4">Debes iniciar sesión para ver tus favoritos.</p>
          <Link to="/login" className="btn btn-primary-accent rounded-pill px-5 py-2">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  // Sin favoritos
  if (favoritos.length === 0) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center p-5">
          <i className="fa-regular fa-heart text-muted mb-4 opacity-25"
            style={{ fontSize: '7rem' }}></i>
          <h2 className="logo-text mb-3" style={{ fontSize: '2.5rem' }}>
            Aún no tienes favoritos
          </h2>
          <p className="lead text-muted mb-5">
            Guarda los productos que más te gusten para encontrarlos fácilmente.
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
    <div className="flex-grow-1 py-5 position-relative">

      {/* Toast añadido al carrito */}
      {showToast && (
        <div className="toast-premium">
          <i className="fa-solid fa-circle-check"></i>
          <span>¡<strong>{toastNombre}</strong> añadido al carrito!</span>
        </div>
      )}

      <div className="container py-lg-4" style={{ maxWidth: '960px' }}>

        {/* Cabecera */}
        <div className="mb-5">
          <h2 className="logo-text fw-bold" style={{ fontSize: '2.2rem' }}>
            <i className="fa-solid fa-heart text-accent me-3"></i> Mis Favoritos
          </h2>
          <p className="text-muted mt-1">
            {favoritos.length} {favoritos.length === 1 ? 'producto guardado' : 'productos guardados'}
          </p>
        </div>

        {/* Grid */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          {favoritos.map((fav) => (
            <div key={fav.favorito_id} className="col">
              {/* Tarjeta — click en cualquier parte navega al detalle */}
              <div
                className="card-premium h-100 d-flex flex-column"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/producto/${fav.producto_id}`)}
              >
                {/* Imagen redondeada por las 4 esquinas */}
                <div style={{
                  height: '190px',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  margin: '12px 12px 0 12px',
                  flexShrink: 0,
                }}>
                  <img
                    src={fav.imagen?.startsWith('http') || fav.imagen?.startsWith('/')
                      ? fav.imagen : `/${fav.imagen}`}
                    alt={fav.titulo}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Info */}
                <div
                  className="p-3 d-flex flex-column flex-grow-1"
                  onClick={(e) => e.stopPropagation()} // evita navegar al clicar en botones
                >
                  <span className="text-muted small text-uppercase fw-bold mb-1"
                    style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                    {fav.categoria?.toLowerCase()}
                  </span>

                  <h6 className="logo-text fw-bold mb-0 mt-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/producto/${fav.producto_id}`)}>
                    {fav.titulo}
                  </h6>

                  {/* Stock bajo */}
                  {fav.stock === 0 ? (
                    <span className="badge rounded-pill mt-2 align-self-start"
                      style={{ backgroundColor: '#f8d7da', color: '#721c24', fontSize: '0.72rem' }}>
                      <i className="fa-solid fa-xmark me-1"></i> Sin stock
                    </span>
                  ) : fav.stock <= 5 ? (
                    <span className="badge rounded-pill mt-2 align-self-start"
                      style={{ backgroundColor: '#fff3cd', color: '#856404', fontSize: '0.72rem' }}>
                      <i className="fa-solid fa-fire me-1"></i> ¡Solo quedan {fav.stock}!
                    </span>
                  ) : <div className="mt-2" />}

                  {/* Precio + botón corazón en la misma fila */}
                  <div className="d-flex align-items-center justify-content-between mt-auto pt-2">
                    <p className="price-text text-accent fw-bold mb-0"
                      style={{ fontSize: '1.3rem' }}>
                      {fav.precio?.importe} {fav.precio?.moneda === 'EUR' ? '€' : fav.precio?.moneda}
                    </p>

                    {/* Botón eliminar de favoritos — al lado del precio */}
                    <button
                      onClick={() => eliminarFavorito(fav.producto_id)}
                      className="btn p-0 border-0 bg-transparent"
                      style={{ fontSize: '1.3rem', lineHeight: 1 }}
                      title="Quitar de favoritos"
                    >
                      <i className="fa-solid fa-heart" style={{ color: '#e74c3c' }}></i>
                    </button>
                  </div>

                  {/* Botón añadir al carrito */}
                  <button
                    className="btn btn-primary-accent rounded-pill w-100 py-2 mt-3 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleAddToCart(fav)}
                    disabled={fav.stock === 0}
                    title={fav.stock === 0 ? 'Sin stock disponible' : 'Añadir al carrito'}
                  >
                    <i className="fa-solid fa-cart-plus fa-sm"></i>
                    <span className="small fw-semibold">
                      {fav.stock === 0 ? 'Sin stock' : 'Añadir al carrito'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MisFavoritos;