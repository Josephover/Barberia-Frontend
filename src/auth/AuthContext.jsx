import { createContext, useContext, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    const { token, nombre, rol } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ nombre, rol }));
    setUser({ nombre, rol });

    return { nombre, rol };
  };

  const register = async (datos) => {
    const response = await axiosClient.post('/auth/register', datos);
    const { token, nombre, rol } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ nombre, rol }));
    setUser({ nombre, rol });

    return { nombre, rol };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}