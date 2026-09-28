import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  function iniciarSesion(tokens) {
    localStorage.setItem('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
    setToken(tokens.access_token);
  }

  function cerrarSesion() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUsuario(null);
  }

  useEffect(() => {
    if (!token) {
      setUsuario(null);
      setCargando(false);
      return;
    }

    setCargando(true);
    getMe()
      .then((data) => {
        setUsuario(data);
      })
      .catch((err) => {
        console.warn('Error al verificar sesión:', err);
        cerrarSesion();
      })
      .finally(() => {
        setCargando(false);
      });
  }, [token]);

  return (
    <AuthContext.Provider value={{ usuario, cargando, token, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
