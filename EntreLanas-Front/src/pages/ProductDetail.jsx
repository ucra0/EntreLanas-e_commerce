import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams(); 
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showToast, setShowToast] = useState(false);
  
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/productos/${id}`)
      .then(res => {
        setProducto(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex-grow-1 d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center text-accent">
        <i className="fa-solid fa-circle-notch fa-spin fa-3x mb-3"></i>
        <h4 className="logo-text">Preparando los ovillos...</h4>
      </div>
    </div>
  );

  if (!producto) return (
    <div className="flex-grow-1 d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center card-premium p-5">
        <i className="fa-regular fa-face-frown text-muted mb-3" style={{ fontSize: '4rem' }}></i>
        <h4 className="logo-text">Producto no encontrado</h4>
        <p className="text-muted">Parece que este artículo ya no está disponible.</p>
        <Link to="/productos" className="btn btn-primary-accent rounded-pill px-4 mt-3">Volver al catálogo</Link>
      </div>
    </div>
  );

  const handleAction = () => {
    if (user) {
      addToCart(producto);
      
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex-grow-1 py-5 position-relative">
      
      
      {showToast && (
        <div className="toast-premium">
          <i className="fa-solid fa-circle-check"></i>
          <span>¡Añadido al carrito con éxito!</span>
        </div>
      )}

      <div className="container py-lg-4">
        
        <div className="mb-4">
          <Link to="/productos" className="text-muted text-decoration-none nav-link-hover">
            <i className="fa-solid fa-arrow-left me-2"></i> Volver al catálogo
          </Link>
        </div>

        <div className="row align-items-center gap-5 gap-lg-0">
          
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="card-premium p-2 shadow-sm d-flex justify-content-center align-items-center position-relative">
              
              <span className="card-tag text-capitalize text-muted border" style={{ top: '1.5rem', left: '1.5rem' }}>
                {producto.categoria?.toLowerCase()}
              </span>

              {producto.stock < 15 && (
                <span className="position-absolute badge bg-danger text-white rounded-pill shadow-sm" style={{ top: '1.5rem', right: '1.5rem', zIndex: 10, fontSize: '0.9rem', padding: '0.5em 1em' }}>
                  <i className="fa-solid fa-fire me-1"></i> ¡Solo quedan {producto.stock}!
                </span>
              )}

              
              <img 
                src={producto.imagen?.startsWith('http') || producto.imagen?.startsWith('/') ? producto.imagen : `/${producto.imagen}`} 
                alt={producto.titulo} 
                className="w-100" 
                style={{ 
                  objectFit: "cover", 
                  maxHeight: "600px", 
                  borderRadius: "15px",
                  aspectRatio: "4/5"
                }} 
              />
            </div>
          </div>

          <div className="col-lg-6 ps-lg-5">
            
            <h1 className="logo-text fw-bold mb-3" style={{ fontSize: '3rem', lineHeight: '1.2' }}>
              {producto.titulo}
            </h1>
            <p className="price-text text-accent mb-4" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
              {producto.precio.importe} {producto.precio.moneda === 'EUR' ? '€' : producto.precio.moneda}
            </p>

            <div className="d-flex flex-wrap gap-2 mb-4 pb-2 border-bottom">
              {producto.color && <span className="badge badge-pastel"><i className="fa-solid fa-palette me-1 text-muted"></i> Color: <span className="text-capitalize">{producto.color.toLowerCase()}</span></span>}
              {producto.talla && <span className="badge badge-pastel"><i className="fa-solid fa-ruler me-1 text-muted"></i> Talla: <span className="text-capitalize">{producto.talla.toLowerCase()}</span></span>}
              {producto.fibra && <span className="badge badge-pastel"><i className="fa-solid fa-leaf me-1 text-muted"></i> Material: <span className="text-capitalize">{producto.fibra.toLowerCase()}</span></span>}
              {producto.estilo && <span className="badge badge-pastel"><i className="fa-solid fa-wand-magic-sparkles me-1 text-muted"></i> Estilo: <span className="text-capitalize">{producto.estilo.toLowerCase()}</span></span>}
              {producto.tipo && <span className="badge badge-pastel"><i className="fa-solid fa-tag me-1 text-muted"></i> Tipo: <span className="text-capitalize">{producto.tipo.toLowerCase()}</span></span>}
            </div>
            
            <p className="lead text-muted mb-5" style={{ lineHeight: '1.8' }}>
              {producto.descripcion ? producto.descripcion : "Un producto artesanal único, tejido con amor y dedicación. Cada puntada cuenta una historia, ideal para regalar a esa persona especial o darte un capricho merecido."}
            </p>

            <div className="d-grid gap-2 d-md-block mb-5">
              <button 
                onClick={handleAction} 
                className={`btn btn-lg rounded-pill px-5 py-3 fs-5 shadow-sm ${user ? 'btn-primary-accent' : 'btn-outline-accent'}`}
              >
                {user ? (
                  <><i className="fa-solid fa-cart-plus me-2"></i> Añadir al carrito</>
                ) : (
                  <><i className="fa-solid fa-lock me-2"></i> Iniciar sesión para comprar</>
                )}
              </button>
            </div>
            
            <ul className="list-unstyled text-muted mt-4 bg-white p-4 rounded-4 border">
              <li className="mb-3 d-flex align-items-center gap-3">
                <div className="bg-light rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                  <i className="fa-solid fa-hand-holding-heart text-accent"></i>
                </div>
                <span>Tejido a mano al <strong>100% con amor</strong></span>
              </li>
              <li className="mb-3 d-flex align-items-center gap-3">
                <div className="bg-light rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                  <i className="fa-solid fa-medal text-accent"></i>
                </div>
                <span>Materiales éticos de <strong>primera calidad</strong></span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <div className="bg-light rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                  <i className="fa-solid fa-box-open text-accent"></i>
                </div>
                <span>Envío seguro a <strong>toda España</strong></span>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;