import { createContext, useState, useEffect, useContext } from 'react';

// 1. Creamos el contexto (la "nube" de datos global)
const AuthContext = createContext();

// 2. El Proveedor que envuelve a la app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Al arrancar, miramos si hay un usuario guardado en el navegador (para que no se borre al recargar)
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario_entrelanas');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Función para LOGIN
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('usuario_entrelanas', JSON.stringify(userData));
  };

  // Función para LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuario_entrelanas');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Un hook personalizado para usarlo fácil
export const useAuth = () => useContext(AuthContext);