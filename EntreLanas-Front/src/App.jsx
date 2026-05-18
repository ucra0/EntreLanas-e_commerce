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
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import AdminLayout from './pages/AdminLayout';
import AdminProductos from './pages/AdminProductos';


function App() {
  return (
   
    <AuthProvider>

      <CartProvider> 
      
        
        <BrowserRouter>
        
        
          <Navbar />

          
          <Routes>
          
            <Route path="/" element={<Home />} />

            <Route path="/productos" element={<Productos />} />
          
            <Route path="/login" element={<Login />} />
            
            {<Route path="/registro" element={<Register />} />}

            <Route path="/carrito" element={<Cart />} />

            <Route path="/producto/:id" element={<ProductDetail />} />

            <Route path="/checkout" element={<Checkout />} />

            <Route path="/mis-pedidos" element={<MisPedidos />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={
                <div className="text-center py-5">
                  <h2 className="logo-text">Bienvenido al Panel de Administración</h2>
                </div>
              }/>
              <Route path="productos" element={<AdminProductos />} />
              <Route path="pedidos"   element={<div className="text-muted text-center py-5">Sección Pedidos — próximamente</div>} />
              <Route path="usuarios"  element={<div className="text-muted text-center py-5">Sección Usuarios — próximamente</div>} />
            </Route>
            
            <Route path="*" element={<Home />} />

          </Routes>

        </BrowserRouter>

      </CartProvider> 

    </AuthProvider>
  );
}

export default App;