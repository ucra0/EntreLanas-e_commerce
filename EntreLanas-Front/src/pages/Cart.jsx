import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { carrito, removeFromCart, updateQuantity, total, setCarrito } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  // PROTEGER LA PÁGINA (Solo logueados)
  if (!user) {
    return (
      <div className="container text-center mt-5 py-5">
        <h2 className="display-4 text-danger fw-bold">🔒 Acceso Restringido</h2>
        <p className="lead mt-3">Debes iniciar sesión para poder ver y gestionar tu carrito de la compra.</p>
        <Link to="/login" className="btn btn-primary btn-lg mt-4 shadow">Ir a Iniciar Sesión</Link>
      </div>
    );
  }

  // CONFIRMACIÓN ANTES DE BORRAR
  const handleRemove = (id) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este producto de tu cesta?");
    if (confirmar) {
      removeFromCart(id);
    }
  };

  const handleCheckout = () => {
    setProcesando(true);
    setTimeout(() => {
      alert(`¡Gracias por tu compra, ${user.nombre}! 🧶\nTu pedido ha sido procesado con éxito.`);
      setCarrito([]); 
      setProcesando(false);
      navigate('/');
    }, 2000);
  };

  if (carrito.length === 0) {
    return (
      <div className="container text-center mt-5 py-5">
        <h2 className="display-4">Tu carrito está vacío 😢</h2>
        <p className="lead mt-3">¡Corre a llenarlo de cosas bonitas!</p>
        <Link to="/productos" className="btn btn-primary btn-lg mt-3 shadow">Ver Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="mb-4 fw-bold text-primary">🛒 Tu Cesta de la Compra</h2>
      
      <div className="row">
        {/* LISTA DE PRODUCTOS */}
        <div className="col-md-8">
          <ul className="list-group shadow-sm border-0">
            {carrito.map((item) => (
              <li key={item.id} className="list-group-item d-flex flex-column flex-md-row align-items-center justify-content-between p-4 mb-2 rounded border">
                
                {/* Info del Producto */}
                <div className="d-flex align-items-center mb-3 mb-md-0 w-100">
                  <img 
                    src={item.imagen} 
                    alt={item.titulo} 
                    className="rounded shadow-sm" 
                    style={{ width: "90px", height: "90px", objectFit: "cover", marginRight: "20px" }}
                  />
                  <div>
                    <h5 className="mb-1 fw-bold text-dark">{item.titulo}</h5>
                    <span className="text-primary fw-bold fs-5">{item.precio.importe} €</span>
                  </div>
                </div>

                {/* MODIFICAR CANTIDADES (+ y -) */}
                <div className="d-flex align-items-center justify-content-between w-100" style={{ maxWidth: "250px" }}>
                  <div className="input-group input-group-sm me-3" style={{ width: "120px" }}>
                    <button 
                      className="btn btn-outline-secondary fw-bold" 
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                    >-</button>
                    <input 
                      type="text" 
                      className="form-control text-center fw-bold" 
                      value={item.cantidad} 
                      readOnly 
                    />
                    <button 
                      className="btn btn-outline-secondary fw-bold" 
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    >+</button>
                  </div>

                  {/* Botón de eliminar con confirmación */}
                  <button onClick={() => handleRemove(item.id)} className="btn btn-danger btn-sm shadow-sm">
                    🗑️
                  </button>
                </div>

              </li>
            ))}
          </ul>
        </div>

        {/* RESUMEN Y PAGO */}
        <div className="col-md-4 mt-4 mt-md-0">
          <div className="card shadow-sm border-0 bg-white">
            <div className="card-body p-4">
              <h4 className="card-title fw-bold mb-4 border-bottom pb-2">Resumen de compra</h4>
              
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Subtotal</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Gastos de Envío</span>
                <span className="text-success fw-bold">Gratis</span>
              </div>
              
              <div className="d-flex justify-content-between my-4 bg-light p-3 rounded">
                <span className="fs-5 fw-bold text-dark">Total</span>
                <span className="fs-4 fw-bold text-primary">{total.toFixed(2)} €</span>
              </div>
              
              <button 
                className="btn btn-success w-100 py-3 fw-bold shadow-sm fs-5"
                onClick={handleCheckout}
                disabled={procesando}
              >
                {procesando ? "Procesando el pago..." : "💳 Finalizar Compra"}
              </button>
              
              <Link to="/productos" className="btn btn-outline-secondary w-100 mt-3 text-decoration-none fw-bold">
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;