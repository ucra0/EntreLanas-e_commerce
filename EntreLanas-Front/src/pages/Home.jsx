import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
  
    axios.get('http://localhost:8080/api/productos')
      .then(res => setDestacados(res.data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-light min-vh-100"> 
      
      {/* SECCIÓN HERO */}
      <div className="bg-white py-5 shadow-sm mb-5 text-center">
        <div className="container">
          <h1 className="display-4 fw-bold text-primary mb-3">Bienvenidos a EntreLanas</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Somos una pequeña tienda artesanal apasionada por el tejido. Cada una de nuestras prendas y peluches está hecha a mano con lanas de origen ético y mucho amor. ¡Encuentra tu pieza única! 🧶✨
          </p>
          <Link to="/productos" className="btn btn-primary btn-lg mt-3 fw-bold shadow">
            Ver todo el catálogo
          </Link>
        </div>
      </div>

      {/* PRODUCTOS DESTACADOS */}
      <div className="container pb-5">
        <h3 className="fw-bold mb-4 border-bottom pb-2">⭐ Productos Destacados</h3>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {destacados.map((prod) => (
            <div key={prod.id} className="col">
              <div className="card h-100 shadow-sm border-0 transition-hover">
                
                <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
                  <img src={prod.imagen} className="card-img-top w-100 h-100" alt={prod.titulo} style={{ objectFit: "cover" }} />
                  {}
                  <span className="position-absolute top-0 start-0 m-2 badge bg-primary bg-opacity-75 text-white text-capitalize shadow-sm">
                    {prod.categoria?.toLowerCase()}
                  </span>
                </div>

                <div className="card-body text-center d-flex flex-column">
                  <h6 className="fw-bold text-dark">{prod.titulo}</h6>
                  
                  {}
                  <p className="text-primary fw-bold fs-5 mt-auto mb-3">
                    {prod.precio.importe} {prod.precio.moneda === 'EUR' ? '€' : prod.precio.moneda}
                  </p>
                  
                  <Link to={`/producto/${prod.id}`} className="btn btn-outline-primary btn-sm w-100 fw-bold">
                    Ver detalles
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE CONTACTO Y MAPA */}
      <div className="bg-white py-5 border-top">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h3 className="fw-bold mb-3">📍 Dónde Encontrarnos</h3>
              <p className="text-muted"><i className="bi bi-geo-alt-fill text-primary"></i> Calle de la Lana Mágica, 42. Madrid, España.</p>
              <p className="text-muted"><i className="bi bi-telephone-fill text-primary"></i> +34 912 345 678</p>
              <p className="text-muted"><i className="bi bi-envelope-fill text-primary"></i> hola@entrelanas.com</p>
              <div className="mt-4">
                <h5 className="fw-bold">Síguenos</h5>
                <button className="btn btn-outline-primary btn-sm me-2">Instagram</button>
                <button className="btn btn-outline-primary btn-sm me-2">Facebook</button>
                <button className="btn btn-outline-primary btn-sm">TikTok</button>
              </div>
            </div>
            
            <div className="col-md-6">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6035133283256!2d-3.703790184600674!3d40.41677537936573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e19e23f5f%3A0x6fb0d7fc219270!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1629883582453!5m2!1ses!2ses" 
                width="100%" 
                height="300" 
                style={{ border: 0, borderRadius: "10px" }} 
                allowFullScreen="" 
                loading="lazy"
                title="Mapa de la tienda"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;