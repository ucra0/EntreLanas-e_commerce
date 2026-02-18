import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

function Productos() {
  const [productos, setProductos] = useState([]);
  
  
  const [searchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get('q') || '';

  useEffect(() => {
    axios.get('http://localhost:8080/api/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  
  const productosFiltrados = productos.filter((prod) => 
    prod.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    prod.categoria.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <h2 className="fw-bold mb-4 text-primary">
          {terminoBusqueda ? `🔍 Resultados para: "${terminoBusqueda}"` : 'Catálogo Completo'}
        </h2>
        
        {productosFiltrados.length === 0 ? (
          <div className="alert alert-warning">No se encontraron productos con esa búsqueda.</div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {productosFiltrados.map((prod) => (
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
                      <Link to={`/producto/${prod.id}`} className="btn btn-primary btn-sm px-3 fw-bold">
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;