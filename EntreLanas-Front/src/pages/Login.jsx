import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  
  const { login } = useAuth();
  const { setCarrito } = useCart(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', formData);
      setCarrito([]); 
      login(res.data);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
          setError(typeof err.response.data === 'string' ? err.response.data : "Credenciales incorrectas");
      } else {
          setError("Error al conectar con el servidor");
      }
    }
  };

  return (
    <div className="flex-grow-1 d-flex align-items-center py-5">
      <div className="container">
        
        
        <div className="card-premium overflow-hidden border-0 shadow-lg p-0" style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '25px' }}>
          <div className="row g-0">
            
            
            <div className="col-md-5 col-lg-6 d-none d-md-block position-relative">
              <img 
                src="/imagenes/fotoiniciosesion.jpg" 
                alt="Lanas artesanales" 
                className="w-100 h-100" 
                style={{ objectFit: 'cover', minHeight: '600px' }}
              />
              
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.6))' }}></div>
              <div className="position-absolute bottom-0 start-0 p-5 text-white">
                <h3 className="logo-text mb-3" style={{ fontSize: '3rem' }}>EntreLanas</h3>
                <p className="lead opacity-75 mb-0">Bienvenido de nuevo a tu rincón de creatividad y calma.</p>
              </div>
            </div>

            
            <div className="col-md-7 col-lg-6 p-4 p-sm-5 bg-white d-flex flex-column justify-content-center">
              
              <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style={{ width: '70px', height: '70px' }}>
                  <i className="fa-solid fa-cookie-bite text-accent fs-1"></i>
                </div>
                <h2 className="logo-text fw-bold mb-2">¡Hola de nuevo!</h2>
                <p className="text-muted">Introduce tus datos para acceder a tu cuenta.</p>
              </div>
              
             
              {error && (
                <div className="alert bg-danger bg-opacity-10 text-danger border-0 rounded-3 mb-4 d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
               
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small text-uppercase">Nombre de Usuario</label>
                  <div className="position-relative">
                    <span className="position-absolute top-50 translate-middle-y text-muted opacity-50" style={{ left: '15px' }}>
                      <i className="fa-regular fa-user"></i>
                    </span>
                    <input 
                      type="text" 
                      name="username" 
                      className="form-control input-premium w-100" 
                      style={{ paddingLeft: '45px' }}
                      placeholder="ej. artesana_maria"
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <label className="form-label fw-bold text-muted small text-uppercase">Contraseña</label>
                  </div>
                  <div className="position-relative">
                    <span className="position-absolute top-50 translate-middle-y text-muted opacity-50" style={{ left: '15px' }}>
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      name="password" 
                      className="form-control input-premium w-100" 
                      style={{ paddingLeft: '45px' }}
                      placeholder="••••••••"
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                
                <div className="mt-5">
                  <button type="submit" className="btn btn-primary-accent rounded-pill w-100 py-3 fs-5 shadow-sm">
                    Iniciar Sesión <i className="fa-solid fa-arrow-right-to-bracket ms-2"></i>
                  </button>
                </div>
              </form>
              
              
              <div className="mt-5 text-center">
                <p className="text-muted mb-0">
                  ¿Aún no tienes cuenta? {' '}
                  <Link to="/registro" className="text-accent fw-bold text-decoration-none nav-link-hover">
                    Regístrate aquí
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;