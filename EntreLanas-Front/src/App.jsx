import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
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
import AdminPedidos from './pages/AdminPedidos';
import AdminUsuarios from './pages/AdminUsuarios';
import { FavoritosProvider } from './context/FavoritosContext';
import MisFavoritos from './pages/MisFavoritos';
import { ListaDeseosProvider } from './context/ListaDeseosContext';
import MisDeseos from './pages/MisDeseos';

// Componente intermedio que puede usar useLocation (requiere estar dentro de BrowserRouter)
function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const esAdmin = location.pathname.startsWith('/admin');
  
  // Si es admin y está en una ruta que no es /admin, redirigir al panel
  if (user?.rol === 'ROLE_ADMIN' && !esAdmin) {
    return <Navigate to="/admin" replace />;
  }

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
        <Route path="/mis-favoritos" element={<MisFavoritos />} />
        <Route path="/mis-deseos" element={<MisDeseos />} />

        {/* Rutas del panel de administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminInicio />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="pedidos" element={<AdminPedidos />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
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
        <FavoritosProvider>
           <ListaDeseosProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
          </ListaDeseosProvider> 
        </FavoritosProvider>  
      </CartProvider>
    </AuthProvider>
  );
}

export default App;