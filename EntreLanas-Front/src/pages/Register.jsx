import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // <--- IMPORTAMOS ESTO PARA EL AUTO-LOGIN

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
    apellidos: '',
    email: '',
    fechaNacimiento: '' // <--- NUEVO CAMPO OBLIGATORIO
  });
  
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // <--- SACAMOS LA FUNCIÓN DE INICIAR SESIÓN

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // FUNCIÓN PARA CALCULAR SI ES +18
  const esMayorDeEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const mes = hoy.getMonth() - cumpleanos.getMonth();
    
    // Si aún no ha llegado su mes de cumpleaños, o es el mes pero no ha llegado el día, restamos 1 año
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad >= 18;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. VALIDACIÓN DE EDAD ANTES DE ENVIAR AL SERVIDOR
    if (!esMayorDeEdad(formData.fechaNacimiento)) {
      setError("❌ Debes ser mayor de 18 años para registrarte en la tienda.");
      return; // Cortamos la ejecución aquí
    }

    try {
      // 2. REGISTRAMOS AL USUARIO EN EL BACKEND
      await axios.post('http://localhost:8080/api/auth/register', formData);
      
      // 3. AUTO-LOGIN: Si el registro fue bien, hacemos petición de login automático
      const resLogin = await axios.post('http://localhost:8080/api/auth/login', {
        username: formData.username,
        password: formData.password
      });

      // 4. GUARDAMOS SESIÓN Y VAMOS A LA HOME DIRECTAMENTE
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
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4 border-0">
            <h2 className="text-center mb-4 fw-bold text-primary">Crear Cuenta</h2>
            
            {/* AQUÍ SE MOSTRARÁ EL ERROR SI TIENE MENOS DE 18 */}
            {error && <div className="alert alert-danger fw-bold">{error}</div>}

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

              {/* NUEVO CAMPO: FECHA DE NACIMIENTO */}
              <div className="mb-3">
                <label className="form-label fw-bold">Fecha de Nacimiento (+18)</label>
                <input 
                  type="date" 
                  name="fechaNacimiento" 
                  className="form-control" 
                  onChange={handleChange} 
                  required 
                />
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
                <button type="submit" className="btn btn-primary fw-bold">Registrarse y Entrar</button>
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