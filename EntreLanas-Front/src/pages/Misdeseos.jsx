import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListaDeseos } from '../context/ListaDeseosContext';

function MisDeseos() {
  const { user }                      = useAuth();
  const { deseos, eliminarDeseo }     = useListaDeseos();
  const navigate                      = useNavigate();

  if (!user) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center card-premium p-5" style={{ maxWidth: '500px' }}>
          <i className="fa-solid fa-lock text-accent mb-4" style={{ fontSize: '4rem' }}></i>
          <h2 className="logo-text mb-3">Acceso Restringido</h2>
          <p className="text-muted mb-4">Debes iniciar sesión para ver tu lista de deseos.</p>
          <Link to="/login" className="btn btn-primary-accent rounded-pill px-5 py-2">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (deseos.length === 0) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center p-5">
          <i className="fa-regular fa-star text-muted mb-4 opacity-25"
            style={{ fontSize: '7rem' }}></i>
          <h2 className="logo-text mb-3" style={{ fontSize: '2.5rem' }}>
            Tu lista de deseos está vacía
          </h2>
          <p className="lead text-muted mb-5">
            Cuando un producto se quede sin stock, podrás guardarlo aquí para no perderlo de vista.
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
    <div className="flex-grow-1 py-5">
      <div className="container py-lg-4" style={{ maxWidth: '960px' }}>

        {/* Cabecera */}
        <div className="mb-5">
          <h2 className="logo-text fw-bold" style={{ fontSize: '2.2rem' }}>
            <i className="fa-solid fa-star text-accent me-3"></i> Lista de Deseos
          </h2>
          <p className="text-muted mt-1">
            {deseos.length} {deseos.length === 1 ? 'producto guardado' : 'productos guardados'} —
            te avisaremos cuando vuelvan a estar disponibles.
          </p>
        </div>

        {/* Aviso informativo */}
        <div className="alert rounded-3 d-flex align-items-center gap-3 mb-4"
          style={{ backgroundColor: '#fff9e6', border: '1px solid #ffe08a', color: '#856404' }}>
          <i className="fa-solid fa-bell fa-lg flex-shrink-0"></i>
          <span className="small">
            <strong>¿Cuándo podré comprarlos?</strong> En cuanto el stock de estos productos se actualice,
            aparecerá el botón de añadir al carrito automáticamente.
          </span>
        </div>

        {/* Grid */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          {deseos.map((deseo) => (
            <div key={deseo.deseo_id} className="col">
              <div
                className="card-premium h-100 d-flex flex-column"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/producto/${deseo.producto_id}`)}
              >
                {/* Imagen redondeada */}
                <div style={{
                  height: '190px',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  margin: '12px 12px 0 12px',
                  flexShrink: 0,
                  position: 'relative',
                }}>
                  <img
                    src={deseo.imagen?.startsWith('http') || deseo.imagen?.startsWith('/')
                      ? deseo.imagen : `/${deseo.imagen}`}
                    alt={deseo.titulo}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', filter: 'grayscale(30%)' }}
                  />
                  {/* Badge sin stock encima de la imagen */}
                  <span
                    className="position-absolute bottom-0 start-0 m-2 badge rounded-pill"
                    style={{ backgroundColor: '#f8d7da', color: '#721c24', fontSize: '0.72rem' }}>
                    <i className="fa-solid fa-xmark me-1"></i> Sin stock
                  </span>
                </div>

                {/* Info */}
                <div
                  className="p-3 d-flex flex-column flex-grow-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-muted small text-uppercase fw-bold mb-1"
                    style={{ letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                    {deseo.categoria?.toLowerCase()}
                  </span>

                  <h6
                    className="logo-text fw-bold mb-0 mt-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/producto/${deseo.producto_id}`)}>
                    {deseo.titulo}
                  </h6>

                  {/* Precio + botón eliminar en misma fila */}
                  <div className="d-flex align-items-center justify-content-between mt-auto pt-3">
                    <p className="price-text text-accent fw-bold mb-0"
                      style={{ fontSize: '1.3rem' }}>
                      {deseo.precio?.importe} {deseo.precio?.moneda === 'EUR' ? '€' : deseo.precio?.moneda}
                    </p>

                    <button
                      onClick={() => eliminarDeseo(deseo.producto_id)}
                      className="btn p-0 border-0 bg-transparent"
                      style={{ fontSize: '1.2rem', lineHeight: 1 }}
                      title="Quitar de la lista de deseos"
                    >
                      <i className="fa-solid fa-star" style={{ color: 'var(--accent-color, #c9a87c)' }}></i>
                    </button>
                  </div>

                  {/* Botón desactivado — sin stock */}
                  <button
                    className="btn rounded-pill w-100 py-2 mt-3 d-flex align-items-center justify-content-center gap-2"
                    disabled
                    style={{
                      backgroundColor: '#f0ebe3',
                      color: '#aaa',
                      border: 'none',
                      cursor: 'not-allowed',
                    }}
                  >
                    <i className="fa-solid fa-clock fa-sm"></i>
                    <span className="small fw-semibold">Sin stock — pendiente</span>
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

export default MisDeseos;