import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 
import { Link } from 'react-router-dom';

function Home() {
  const [productos, setProductos] = useState([]);
  const { addToCart } = useCart(); 

  useEffect(() => {
    axios.get('http://localhost:8080/api/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-light min-vh-100"> 
      <div className="bg-white py-5 shadow-sm mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold text-primary">Nuestros Productos</h1>
          <p className="lead text-muted">Hechos a mano con mucho cariño 🧶</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {productos.map((prod) => (
            <div key={prod.id} className="col">
              <div className="card h-100 shadow-sm border-0 transition-hover">
                <div style={{ height: "250px", overflow: "hidden", backgroundColor: "#f8f9fa" }}>
                  <img src={prod.imagen} className="card-img-top w-100 h-100" alt={prod.titulo} style={{ objectFit: "cover" }} />
                </div>
                
                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">
                      {prod.categoria}
                    </span>
                  </div>
                  <h5 className="card-title fw-bold text-dark">{prod.titulo}</h5>
                  
                  <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
                    <span className="fs-5 fw-bold text-secondary">{prod.precio.importe} €</span>
                    
                    {}
                    <Link 
                      to={`/producto/${prod.id}`} 
                      className="btn btn-primary btn-sm px-3 fw-bold"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;