import { useState, useEffect, createContext, useContext } from 'react';
import { AuthService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ayusethu_token');
    const cachedUser = localStorage.getItem('ayusethu_user');
    if (token && cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await AuthService.login({ email, password });
    if (res.data.success) {
      const { token, user: userData } = res.data.data;
      localStorage.setItem('ayusethu_token', token);
      localStorage.setItem('ayusethu_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
  };

  const register = async (userData) => {
    const res = await AuthService.register(userData);
    if (res.data.success) {
      const { token, user: newUserData } = res.data.data;
      localStorage.setItem('ayusethu_token', token);
      localStorage.setItem('ayusethu_user', JSON.stringify(newUserData));
      setUser(newUserData);
      return newUserData;
    }
  };

  const logout = () => {
    localStorage.removeItem('ayusethu_token');
    localStorage.removeItem('ayusethu_user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
