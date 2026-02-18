import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { carrito, removeFromCart, total, setCarrito } = useCart(); 
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

 
  const handleCheckout = () => {
    
    if (!user) {
      alert("⚠️ Debes iniciar sesión para comprar.");
      navigate('/login');
      return;
    }

    
    setProcesando(true);
    
    setTimeout(() => {
      
      alert(`¡Gracias por tu compra, ${user.nombre}! 🧶\nTu pedido ha sido procesado.`);
      
      
      carrito.forEach(item => removeFromCart(item.id)); 
      
      setProcesando(false);
      navigate('/'); 
    }, 2000); 
  };

  if (carrito.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h2 className="display-4">Tu carrito está vacío 😢</h2>
        <p className="lead">¡Corre a llenarlo de cosas bonitas!</p>
        <Link to="/" className="btn btn-primary btn-lg mt-3">Volver a la Tienda</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">🛒 Tu Cesta de la Compra</h2>
      
      <div className="row">
        {}
        <div className="col-md-8">
          <ul className="list-group shadow-sm">
            {carrito.map((item) => (
              <li key={item.id} className="list-group-item d-flex align-items-center justify-content-between p-3">
                <div className="d-flex align-items-center">
                  <img 
                    src={item.imagen} 
                    alt={item.titulo} 
                    className="rounded" 
                    style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "15px" }}
                  />
                  <div>
                    <h5 className="mb-1 fw-bold">{item.titulo}</h5>
                    <p className="mb-0 text-muted small">Cantidad: {item.cantidad}</p>
                    <span className="text-primary fw-bold">{item.precio.importe} €</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="btn btn-outline-danger btn-sm">
                  🗑️ Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <h4 className="card-title fw-bold mb-4">Resumen</h4>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Envío</span>
                <span className="text-success">Gratis</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-4 fw-bold">Total</span>
                <span className="fs-4 fw-bold text-primary">{total.toFixed(2)} €</span>
              </div>
              
              {}
              <button 
                className="btn btn-success w-100 py-2 fw-bold shadow"
                onClick={handleCheckout}
                disabled={procesando}
              >
                {procesando ? "Procesando..." : "💳 Pagar Ahora"}
              </button>
              
              <Link to="/" className="btn btn-link w-100 mt-2 text-decoration-none text-muted">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;