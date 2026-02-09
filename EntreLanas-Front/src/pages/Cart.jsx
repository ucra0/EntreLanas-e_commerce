import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // <--- IMPORTAMOS ESTO
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { carrito, removeFromCart, total, setCarrito } = useCart(); // Necesitamos setCarrito para vaciarlo
  const { user } = useAuth(); // Necesitamos saber si está logueado
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  // FUNCIÓN DE PAGO
  const handleCheckout = () => {
    // 1. Si no hay usuario, mandamos al Login
    if (!user) {
      alert("⚠️ Debes iniciar sesión para comprar.");
      navigate('/login');
      return;
    }

    // 2. Simulamos proceso de pago
    setProcesando(true);
    
    setTimeout(() => {
      // 3. ¡Éxito!
      alert(`¡Gracias por tu compra, ${user.nombre}! 🧶\nTu pedido ha sido procesado.`);
      
      // 4. Vaciamos el carrito (truco: pasamos array vacío)
      // OJO: Tienes que añadir 'setCarrito' al export del CartContext si no lo tienes, 
      // pero si te da error, usa un bucle rápido de borrado:
      carrito.forEach(item => removeFromCart(item.id)); 
      
      setProcesando(false);
      navigate('/'); // Volvemos a la tienda
    }, 2000); // Tardamos 2 segundos para dar emoción
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
        {/* COLUMNA IZQUIERDA */}
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

        {/* COLUMNA DERECHA */}
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
              
              {/* BOTÓN CON LÓGICA */}
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