import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]); // lista de FavoritoDTO

  // Cargar favoritos del usuario al iniciar sesión
  useEffect(() => {
    if (!user) {
      setFavoritos([]);
      return;
    }
    fetchFavoritos();
  }, [user]);

  const fetchFavoritos = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/favoritos/usuario/${user.usuario_id}`);
      if (!res.ok) return;
      setFavoritos(await res.json());
    } catch {
      console.error('Error al cargar favoritos');
    }
  };

  // Comprueba si un producto ya es favorito (por producto_id)
  const esFavorito = (productoId) =>
    favoritos.some(f => f.producto_id === productoId);

  // Obtiene el favorito_id de un producto (para poder eliminarlo)
  const getFavoritoId = (productoId) =>
    favoritos.find(f => f.producto_id === productoId)?.favorito_id;

  // Añadir favorito
  const añadirFavorito = async (productoId) => {
    if (!user) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/favoritos?usuarioId=${user.usuario_id}&productoId=${productoId}`,
        { method: 'POST' }
      );
      if (!res.ok) return;
      const nuevo = await res.json();
      setFavoritos(prev => [...prev, nuevo]);
    } catch {
      console.error('Error al añadir favorito');
    }
  };

  // Eliminar favorito
  const eliminarFavorito = async (productoId) => {
    const favoritoId = getFavoritoId(productoId);
    if (!favoritoId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/favoritos/${favoritoId}`, { method: 'DELETE' });
      if (!res.ok) return;
      setFavoritos(prev => prev.filter(f => f.favorito_id !== favoritoId));
    } catch {
      console.error('Error al eliminar favorito');
    }
  };

  // Toggle — si es favorito lo quita, si no lo añade
  const toggleFavorito = (productoId) => {
    if (esFavorito(productoId)) {
      eliminarFavorito(productoId);
    } else {
      añadirFavorito(productoId);
    }
  };

  return (
    <FavoritosContext.Provider value={{
      favoritos,
      esFavorito,
      toggleFavorito,
      eliminarFavorito,
      cantidadFavoritos: favoritos.length,
    }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);