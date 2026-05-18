import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import AdminLayout from './pages/AdminLayout';
import AdminInicio from './pages/AdminInicio';
import AdminProductos from './pages/AdminProductos';

// Componente intermedio que puede usar useLocation (requiere estar dentro de BrowserRouter)
function AppContent() {
  const location = useLocation();
  const esAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {/* El Navbar solo se muestra fuera del panel de administración */}
      {!esAdmin && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />

        {/* Rutas del panel de administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminInicio />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="pedidos"   element={<div className="text-muted text-center py-5">Pedidos — próximamente</div>} />
          <Route path="usuarios"  element={<div className="text-muted text-center py-5">Usuarios — próximamente</div>} />
        </Route>

        {/* Ruta catch-all */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;