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
    
    <div className="flex-grow-1">
      
      {/* SECCIÓN HERO */}
      <div className="container py-5 my-lg-5">
        <div className="row align-items-center gap-5 gap-lg-0">
          
          
          <div className="col-lg-6 text-center text-lg-start">
            <h1 className="logo-text mb-4" style={{ fontSize: '4rem', lineHeight: '1.1' }}>
              Bienvenidos a <br/>
              <span className="text-accent" style={{ fontStyle: 'italic' }}>EntreLanas</span>
            </h1>
            <p className="lead text-muted mb-5" style={{ maxWidth: '500px', margin: '0 auto 0 0' }}>
              Somos una pequeña tienda artesanal apasionada por el tejido. Cada una de nuestras prendas y peluches está hecha a mano con lanas de origen ético y mucho amor. ¡Encuentra tu pieza única!
            </p>
            <Link to="/productos" className="btn bg-accent rounded-pill px-5 py-3 fs-5 shadow-sm nav-link-hover text-white">
              Ver todo el catálogo
            </Link>
          </div>
          
          
          <div className="col-lg-6 text-center">
            
            <img 
              src="/imagenes/fotoburbuja.jpg" 
              alt="fotoburbuja" 
              className="hero-blob w-100"
              style={{ maxWidth: '450px' }}
            />
          </div>

        </div>
      </div>

      {/* SECCIÓN PRODUCTOS DESTACADOS */}
      <div className="container py-5 my-5 text-center">
        
        
        <h2 className="logo-text mb-5 title-impressive">
          
          Productos Destacados
        </h2>
        
        
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 text-start mt-4">
          {destacados.map((prod) => (
            <div key={prod.id} className="col">
              <div className="card-premium h-100 d-flex flex-column text-center text-decoration-none text-dark shadow-sm">
                
                
                <span className="card-tag text-capitalize text-muted border">
                  {prod.categoria?.toLowerCase()}
                </span>
                
                
                <div className="card-img-premium">
                  <img src={prod.imagen} alt={prod.titulo} />
                </div>
                
                
                <h5 className="fw-bold mt-2 mb-1">{prod.titulo}</h5>
                <p className="price-text fs-4 mb-4 mt-auto">
                  {prod.precio.importe} {prod.precio.moneda === 'EUR' ? '€' : prod.precio.moneda}
                </p>
                
                
                <Link to={`/producto/${prod.id}`} className="btn btn-outline-accent w-100 py-2">
                  Ver detalles
                </Link>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-top py-5">
        <div className="container py-4">
          <div className="row gap-4 gap-lg-0">
            
            
            <div className="col-lg-6">
              <h3 className="logo-text mb-4 fs-2">Dónde Encontrarnos</h3>
              <p className="text-muted fs-5"><i className="fa-solid fa-location-dot text-accent me-3"></i> Calle de la Lana Mágica, 42. Madrid.</p>
              <p className="text-muted fs-5"><i className="fa-solid fa-phone text-accent me-3"></i> +34 912 345 678</p>
              <p className="text-muted fs-5"><i className="fa-regular fa-envelope text-accent me-3"></i> hola@entrelanas.com</p>
              
              
              <div className="d-flex gap-3 mt-4">
                <a href="#" className="btn rounded-circle border d-flex align-items-center justify-content-center nav-link-hover" style={{ width: '50px', height: '50px' }}>
                  <i className="fa-brands fa-instagram fs-4 text-dark"></i>
                </a>
                <a href="#" className="btn rounded-circle border d-flex align-items-center justify-content-center nav-link-hover" style={{ width: '50px', height: '50px' }}>
                  <i className="fa-brands fa-facebook-f fs-4 text-dark"></i>
                </a>
                <a href="#" className="btn rounded-circle border d-flex align-items-center justify-content-center nav-link-hover" style={{ width: '50px', height: '50px' }}>
                  <i className="fa-brands fa-tiktok fs-4 text-dark"></i>
                </a>
              </div>
            </div>
            
            
            <div className="col-lg-6">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12149.610058252445!2d-3.7145763000000005!3d40.4180808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x422997b068da6c39%3A0x1d4d8c6b44747738!2sPuerta%20del%20Sol%2C%2020220%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses" 
                className="w-100 shadow-sm"
                height="300" 
                style={{ border: 0, borderRadius: "20px" }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;