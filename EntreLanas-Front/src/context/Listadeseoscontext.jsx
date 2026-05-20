import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const ListaDeseosContext = createContext();

export const ListaDeseosProvider = ({ children }) => {
  const { user } = useAuth();
  const [deseos, setDeseos] = useState([]);

  useEffect(() => {
    if (!user) { setDeseos([]); return; }
    fetchDeseos();
  }, [user]);

  const fetchDeseos = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/deseos/usuario/${user.usuario_id}`);
      if (!res.ok) return;
      setDeseos(await res.json());
    } catch {
      console.error('Error al cargar lista de deseos');
    }
  };

  const esDeseo = (productoId) =>
    deseos.some(d => d.producto_id === productoId);

  const getDeseoId = (productoId) =>
    deseos.find(d => d.producto_id === productoId)?.deseo_id;

  const añadirDeseo = async (productoId) => {
    if (!user) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/deseos?usuarioId=${user.usuario_id}&productoId=${productoId}`,
        { method: 'POST' }
      );
      if (!res.ok) return;
      const nuevo = await res.json();
      setDeseos(prev => [...prev, nuevo]);
    } catch {
      console.error('Error al añadir deseo');
    }
  };

  const eliminarDeseo = async (productoId) => {
    const deseoId = getDeseoId(productoId);
    if (!deseoId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/deseos/${deseoId}`, { method: 'DELETE' });
      if (!res.ok) return;
      setDeseos(prev => prev.filter(d => d.deseo_id !== deseoId));
    } catch {
      console.error('Error al eliminar deseo');
    }
  };

  const toggleDeseo = (productoId) => {
    if (esDeseo(productoId)) eliminarDeseo(productoId);
    else añadirDeseo(productoId);
  };

  return (
    <ListaDeseosContext.Provider value={{
      deseos,
      esDeseo,
      toggleDeseo,
      eliminarDeseo,
      cantidadDeseos: deseos.length,
    }}>
      {children}
    </ListaDeseosContext.Provider>
  );
};

export const useListaDeseos = () => useContext(ListaDeseosContext);