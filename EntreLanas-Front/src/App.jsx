import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';

function App() {
  return (
    // 1. AuthProvider envuelve a toda la aplicación para que el usuario sea accesible desde cualquier sitio
    <AuthProvider>

      <CartProvider> 
      
        {/* 2. BrowserRouter habilita la navegación sin recargar la página */}
        <BrowserRouter>
        
          {/* 3. El Navbar se pone AQUÍ, fuera de Routes, para que aparezca en TODAS las páginas */}
          <Navbar />

          {/* 4. Routes define qué componente se muestra según la URL */}
          <Routes>
          
            {/* Ruta principal (Home) */}
            <Route path="/" element={<Home />} />
          
            {/* Ruta de Login */}
            <Route path="/login" element={<Login />} />
          
            {/* Ruta de Registro */}
            {<Route path="/registro" element={<Register />} />}

            <Route path="/carrito" element={<Cart />} />

            {/* Ruta para cualquier URL desconocida (opcional, redirige a Home) */}
            <Route path="*" element={<Home />} />

          </Routes>

        </BrowserRouter>

      </CartProvider> 

    </AuthProvider>
  );
}

export default App;