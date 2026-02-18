import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { carrito, removeFromCart, updateQuantity, total, setCarrito } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);
  const [showCheckoutToast, setShowCheckoutToast] = useState(false);

  
  if (!user) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center card-premium p-5" style={{ maxWidth: '500px' }}>
          <i className="fa-solid fa-lock text-accent mb-4" style={{ fontSize: '4rem' }}></i>
          <h2 className="logo-text mb-3">Acceso Restringido</h2>
          <p className="text-muted mb-4">Debes iniciar sesión para poder ver y gestionar tu cesta de lanas.</p>
          <Link to="/login" className="btn btn-primary-accent rounded-pill px-5 py-2">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

 
  const handleRemove = (id) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres quitar este artículo de tu cesta?");
    if (confirmar) {
      removeFromCart(id);
    }
  };

  
  const handleCheckout = () => {
    setProcesando(true); //

    
    setTimeout(() => {
      setProcesando(false); 
      setShowCheckoutToast(true); 

      
      setTimeout(() => {
        setCarrito([]); 
        setShowCheckoutToast(false);
        navigate('/');
      }, 3000);

    }, 2000);
  };

  
  if (carrito.length === 0 && !showCheckoutToast) { 
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center p-5">
          <i className="fa-solid fa-basket-shopping text-muted mb-4 opacity-25" style={{ fontSize: '7rem' }}></i>
          <h2 className="logo-text mb-3" style={{ fontSize: '2.5rem' }}>Tu cesta está vacía</h2>
          <p className="lead text-muted mb-5">Aún no has elegido ninguna maravilla tejida a mano.</p>
          <Link to="/productos" className="btn btn-primary-accent rounded-pill px-5 py-3 fs-5 shadow-sm">
            <i className="fa-solid fa-wand-magic-sparkles me-2"></i> Descubrir el Catálogo
          </Link>
        </div>
      </div>
    );
  }

 
  return (
    <div className="flex-grow-1 py-5 position-relative">
      
      
      {showCheckoutToast && (
        <div className="toast-premium" style={{ backgroundColor: '#2C2A29' }}>
          <i className="fa-solid fa-gift fs-4 text-accent"></i>
          <span>¡Pedido completado! Gracias por tu compra, {user.nombre}.</span>
        </div>
      )}

      <div className="container py-lg-4">
        
        <h2 className="logo-text mb-5 text-center" style={{ fontSize: '2.5rem' }}>
          <i className="fa-solid fa-cart-shopping text-accent me-3"></i> 
          Tu Cesta de la Compra
        </h2>
        
        <div className="row gap-5 gap-lg-0 align-items-start">
          
          
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">
              {carrito.map((item) => (
                <div key={item.id} className="card-premium p-3 d-flex flex-column flex-md-row align-items-center gap-4 position-relative">
                  
                  <div className="rounded-4 overflow-hidden shadow-sm" style={{ width: "120px", height: "120px", flexShrink: 0 }}>
                    <img 
                      src={item.imagen?.startsWith('http') || item.imagen?.startsWith('/') ? item.imagen : `/${item.imagen}`} 
                      alt={item.titulo} 
                      className="w-100 h-100" 
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  
                  <div className="flex-grow-1 text-center text-md-start w-100">
                    <span className="text-muted small text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>
                      {item.categoria}
                    </span>
                    <Link to={`/producto/${item.id}`} className="text-decoration-none text-dark nav-link-hover">
                        <h5 className="logo-text fw-bold fs-4 mt-1 mb-2">{item.titulo}</h5>
                    </Link>
                    <p className="text-accent fw-bold fs-5 mb-0">
                      {item.precio.importe} {item.precio.moneda === 'EUR' ? '€' : item.precio.moneda}
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-4 w-100 w-md-auto justify-content-center justify-content-md-end mt-3 mt-md-0">
                    
                    <div className="d-flex align-items-center bg-light rounded-pill border" style={{ padding: '4px' }}>
                      <button 
                        className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center border-0 text-muted" 
                        style={{ width: '32px', height: '32px', transition: '0.2s' }}
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        <i className="fa-solid fa-minus small"></i>
                      </button>
                      <span className="fw-bold px-3 text-dark" style={{ minWidth: '40px', textAlign: 'center' }}>{item.cantidad}</span>
                      <button 
                        className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center border-0 text-muted" 
                        style={{ width: '32px', height: '32px', transition: '0.2s' }}
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      >
                        <i className="fa-solid fa-plus small"></i>
                      </button>
                    </div>

                    <button 
                      onClick={() => handleRemove(item.id)} 
                      className="btn btn-link text-muted p-0 nav-link-hover text-decoration-none"
                      title="Quitar producto"
                      style={{ transition: '0.3s' }}
                    >
                      <i className="fa-regular fa-trash-can fs-4 hover-text-danger"></i>
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="col-lg-4">
            <div className="card-premium sticky-sidebar p-4">
              <h4 className="logo-text fw-bold mb-4 border-bottom pb-3">Resumen de compra</h4>
              
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Subtotal ({carrito.reduce((acc, item) => acc + item.cantidad, 0)} artículos)</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Gastos de Envío</span>
                <span className="badge badge-pastel text-success bg-success bg-opacity-10 border-success" style={{color: '#198754 !important'}}>¡Gratis!</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center my-4 py-3 border-top border-bottom">
                <span className="fs-4 fw-bold text-dark logo-text">Total</span>
                <span className="logo-text text-accent fw-bold" style={{ fontSize: '2.2rem' }}>
                  {total.toFixed(2)} €
                </span>
              </div>
              
              <button 
                className="btn btn-primary-accent w-100 rounded-pill py-3 fs-5 shadow-sm mb-3 d-flex justify-content-center align-items-center gap-2"
                onClick={handleCheckout}
                disabled={procesando || carrito.length === 0}
              >
                {procesando ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Procesando pago...</>
                ) : (
                  <><i className="fa-solid fa-lock me-2"></i> Finalizar Compra Segura</>
                )}
              </button>
              
              <Link to="/productos" className="btn btn-outline-accent w-100 rounded-pill py-2 text-decoration-none">
                <i className="fa-solid fa-arrow-left me-2"></i> Seguir comprando
              </Link>

              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted small mb-2"><i className="fa-solid fa-shield-halved me-1 text-accent"></i> Transacción 100% segura y encriptada</p>
                <div className="d-flex justify-content-center gap-3 text-muted opacity-50 mt-3">
                  <i className="fa-brands fa-cc-visa fa-2x"></i>
                  <i className="fa-brands fa-cc-mastercard fa-2x"></i>
                  <i className="fa-brands fa-cc-amex fa-2x"></i>
                  <i className="fa-brands fa-paypal fa-2x"></i>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;