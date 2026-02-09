import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Petición al Backend
      const res = await axios.post('http://localhost:8080/api/auth/login', formData);
      
      // Si funciona, guardamos usuario y vamos al Home
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4 border-0">
            <h2 className="text-center mb-4 fw-bold text-primary">Iniciar Sesión</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Usuario</label>
                <input 
                  type="text" 
                  name="username"
                  className="form-control" 
                  value={formData.username}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Contraseña</label>
                <input 
                  type="password" 
                  name="password"
                  className="form-control" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary fw-bold">Entrar</button>
              </div>
            </form>
            
            <div className="mt-3 text-center">
                <small>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></small>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;