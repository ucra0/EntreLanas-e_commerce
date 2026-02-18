import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';


function ProductDetail() {
  const { id } = useParams(); // Saca el ID de la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Pedimos el producto por su ID
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

  if (loading) return <div className="container mt-5 text-center"><h4>Cargando... 🧶</h4></div>;
  if (!producto) return <div className="container mt-5 text-center"><h4>Producto no encontrado 😢</h4></div>;

  // Manejar el clic del botón
  const handleAction = () => {
    if (user) {
      addToCart(producto);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Columna Izquierda: Imagen */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: "#f8f9fa", overflow: "hidden" }}>
            <img 
              src={producto.imagen} 
              alt={producto.titulo} 
              className="img-fluid w-100" 
              style={{ objectFit: "cover", maxHeight: "500px" }} 
            />
          </div>
        </div>

        {/* Columna Derecha: Detalles */}
        <div className="col-md-6">
          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 mb-2">
            {producto.categoria}
          </span>
          <h1 className="fw-bold mb-3">{producto.titulo}</h1>
          <h3 className="text-primary fw-bold mb-4">{producto.precio.importe} €</h3>
          
          <p className="lead text-muted mb-4">
            {producto.descripcion ? producto.descripcion : "Un producto artesanal único, tejido con amor y dedicación. Ideal para regalar o darte un capricho."}
          </p>

          <div className="d-grid gap-2 d-md-block mb-4">
            <button 
              onClick={handleAction} 
              className={`btn btn-lg px-5 fw-bold shadow-sm ${user ? 'btn-success' : 'btn-outline-primary'}`}
            >
              {user ? '🛒 Añadir al carrito' : '🔒 Iniciar sesión para comprar'}
            </button>
          </div>
          
          <hr />
          
          <ul className="list-unstyled text-muted mt-4">
            <li className="mb-2">✔️ Hecho a mano 100%</li>
            <li className="mb-2">✔️ Materiales de primera calidad</li>
            <li>✔️ Envío a toda España</li>
          </ul>

          <Link to="/" className="btn btn-link text-decoration-none mt-3">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;