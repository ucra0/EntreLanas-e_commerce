import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Login from './pages/Login';
import Register from './pages/Register';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    // AuthProvider envuelve a toda la aplicación para que el usuario sea accesible desde cualquier sitio
    <AuthProvider>

      <CartProvider> 
      
        {/* BrowserRouter habilita la navegación sin recargar la página */}
        <BrowserRouter>
        
          {/* El Navbar se pone aquí, fuera de Routes, para que aparezca en todas las páginas */}
          <Navbar />

          {/* Routes define qué componente se muestra según la URL */}
          <Routes>
          
            {/* Ruta principal (Home) */}
            <Route path="/" element={<Home />} />

            <Route path="/productos" element={<Productos />} />
          
            {/* Ruta de Login */}
            <Route path="/login" element={<Login />} />
          
            {/* Ruta de Registro */}
            {<Route path="/registro" element={<Register />} />}

            <Route path="/carrito" element={<Cart />} />

            <Route path="/producto/:id" element={<ProductDetail />} />

            {/* Ruta para cualquier URL desconocida (opcional, redirige a Home) */}
            <Route path="*" element={<Home />} />

          </Routes>

        </BrowserRouter>

      </CartProvider> 

    </AuthProvider>
  );
}

export default App;