import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
    apellidos: '',
    email: '',
    fechaNacimiento: '' 
  });
  
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const esMayorDeEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const mes = hoy.getMonth() - cumpleanos.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad >= 18;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    
    if (!esMayorDeEdad(formData.fechaNacimiento)) {
      setError("Debes ser mayor de 18 años para registrarte en la tienda.");
      return; 
    }

    try {
      
      await axios.post('http://localhost:8080/api/auth/register', formData);
      
      
      const resLogin = await axios.post('http://localhost:8080/api/auth/login', {
        username: formData.username,
        password: formData.password
      });

      
      login(resLogin.data);
      navigate('/');

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : "Error al registrar usuario");
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };

  return (
    <div className="flex-grow-1 d-flex align-items-center py-5">
      <div className="container">
        
        
        <div className="card-premium overflow-hidden border-0 shadow-lg p-0" style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '25px' }}>
          <div className="row g-0 flex-column-reverse flex-md-row">
            
            
            <div className="col-md-7 col-lg-6 p-4 p-sm-5 bg-white d-flex flex-column justify-content-center">
              
              <div className="text-center mb-4">
                <h2 className="logo-text fw-bold mb-2">Únete a la Familia</h2>
                <p className="text-muted small">Crea tu cuenta para empezar a tejer historias con nosotros.</p>
              </div>
              
              
              {error && (
                <div className="alert bg-danger bg-opacity-10 text-danger border-0 rounded-3 mb-4 d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span className="small fw-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                
                
                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold text-muted small text-uppercase">Nombre</label>
                    <div className="position-relative">
                      <span className="position-absolute top-50 translate-middle-y text-muted opacity-50" style={{ left: '15px' }}>
                        <i className="fa-regular fa-id-card"></i>
                      </span>
                      <input type="text" name="nombre" className="form-control input-premium w-100" style={{ paddingLeft: '45px' }} placeholder="Tu nombre" onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label className="form-label fw-bold text-muted small text-uppercase">Apellidos</label>
                    <div className="position-relative">
                      <span className="position-absolute top-50 translate-middle-y text-muted opacity-50" style={{ left: '15px' }}>
                        <i className="fa-regular fa-id-card"></i>
                      </span>
                      <input type="text" name="apellidos" className="form-control input-premium w-100" style={{ paddingLeft: '45px' }} placeholder="Tus apellidos" onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small text-uppercase">Correo Electrónico</label>
                  <div className="position-relative">
                    <span className="position-absolute top-50 translate-middle-y text-muted opacity-50" style={{ left: '15px' }}>
                      <i className="fa-regular fa-envelope"></i>
                    </span>
                    <input type="email" name="email" className="form-control input-premium w-100" style={{ paddingLeft: '45px' }} placeholder="ejemplo@correo.com" onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small text-uppercase">Fecha de Nacimiento</label>
                  <div className="position-relative">
                    <span className="position-absolute top-50 translate-middle-y text-muted opacity-50" style={{ left: '15px' }}>
                      <i className="fa-solid fa-cake-candles"></i>
                    </span>
                    <input type="date" name="fechaNacimiento" className="form-control input-premium w-100 text-muted" style={{ paddingLeft: '45px' }} onChange={handleChange} required />
                  </div>
                </div>

                
                <div className="row">
                  <div className="col-sm-6 mb-4">
                    <label className="form-label fw-bold text-muted small text-uppercase">Usuario</label>
                    <div className="position-relative">
                      <span className="position-absolute top-50 translate-middle-y text-muted opacity-50" style={{ left: '15px' }}>
                        <i className="fa-regular fa-user"></i>
                      </span>
                      <input type="text" name="username" className="form-control input-premium w-100" style={{ paddingLeft: '45px' }} placeholder="Apodo" onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-sm-6 mb-4">
                    <label className="form-label fw-bold text-muted small text-uppercase">Contraseña</label>
                    <div className="position-relative">
                      <span className="position-absolute top-50 translate-middle-y text-muted opacity-50" style={{ left: '15px' }}>
                        <i className="fa-solid fa-lock"></i>
                      </span>
                      <input type="password" name="password" className="form-control input-premium w-100" style={{ paddingLeft: '45px' }} placeholder="••••••••" onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                
                <div className="mt-4">
                  <button type="submit" className="btn btn-primary-accent rounded-pill w-100 py-3 fs-5 shadow-sm d-flex justify-content-center align-items-center gap-2">
                    <i className="fa-solid fa-user-plus"></i> Crear Cuenta
                  </button>
                </div>
              </form>
              
              
              <div className="mt-4 text-center">
                <p className="text-muted small mb-0">
                  ¿Ya eres parte de la familia? {' '}
                  <Link to="/login" className="text-accent fw-bold text-decoration-none nav-link-hover">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>

            </div>

            
            <div className="col-md-5 col-lg-6 d-none d-md-block position-relative">
              <img 
                src="/imagenes/fotoregistro.jpg" 
                alt="Foto Registro" 
                className="w-100 h-100" 
                style={{ objectFit: 'cover', minHeight: '600px' }}
              />
              
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.1), rgba(0,0,0,0.6))' }}></div>
              <div className="position-absolute bottom-0 end-0 p-5 text-white text-end">
                <h3 className="logo-text mb-3" style={{ fontSize: '2.5rem' }}>Artesanía Única</h3>
                <p className="lead opacity-75 mb-0" style={{ maxWidth: '300px', marginLeft: 'auto' }}>
                  Piezas exclusivas, hechas con materiales éticos y muchísimo amor.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;