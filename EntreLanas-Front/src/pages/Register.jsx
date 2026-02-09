import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
    apellidos: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Enviamos los datos al endpoint de registro
      await axios.post('http://localhost:8080/api/auth/register', formData);
      
      // 2. Si sale bien, redirigimos al Login para que entre
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      navigate('/login');

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
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4 border-0">
            <h2 className="text-center mb-4 fw-bold text-primary">Crear Cuenta</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Nombre</label>
                  <input type="text" name="nombre" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Apellidos</label>
                  <input type="text" name="apellidos" className="form-control" onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input type="email" name="email" className="form-control" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Usuario</label>
                <input type="text" name="username" className="form-control" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Contraseña</label>
                <input type="password" name="password" className="form-control" onChange={handleChange} required />
              </div>

              <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-primary fw-bold">Registrarse</button>
              </div>
            </form>
            
            <div className="mt-3 text-center">
                <small>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></small>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;