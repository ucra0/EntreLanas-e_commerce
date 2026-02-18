import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Aquí definimos el estado del carrito
  const [carrito, setCarrito] = useState(() => {
    const savedCart = localStorage.getItem('carrito_entrelanas');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardamos en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('carrito_entrelanas', JSON.stringify(carrito));
  }, [carrito]);

  // Función para añadir
  const addToCart = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(item => item.id === producto.id);
      if (existe) {
        return prevCarrito.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCarrito, { ...producto, cantidad: 1 }];
    });
    alert("¡Producto añadido al carrito! 🧶");
  };

  // Función para eliminar
  const removeFromCart = (productoId) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== productoId));
  };

  // Cálculos
  const total = carrito.reduce((acc, item) => acc + (item.precio.importe * item.cantidad), 0);
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  
  return (
    
    <CartContext.Provider value={{ 
        carrito, 
        addToCart, 
        removeFromCart, 
        total, 
        cantidadTotal, 
        setCarrito 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);