import { createContext, useState, useEffect, useContext } from 'react';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario_entrelanas');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('usuario_entrelanas', JSON.stringify(userData));
  };

  
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


export const useAuth = () => useContext(AuthContext);