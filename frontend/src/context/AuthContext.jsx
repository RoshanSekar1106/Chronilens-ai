import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, isDemoMode, setDemoMode as enableDemo } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('chronilens_token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('chronilens_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [demoActive, setDemoActive] = useState(isDemoMode());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (demoActive && !token) {
      enableDemo(true);
      setToken(localStorage.getItem('chronilens_token') || '');
      setUser({ name: 'Health Explorer', email: 'user@chronilens.ai' });
    }
  }, [demoActive, token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (data.token) {
        setToken(data.token);
        const userData = { name: email.split('@')[0], email };
        setUser(userData);
        localStorage.setItem('chronilens_user', JSON.stringify(userData));
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register({ name, email, password });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken('');
    setUser(null);
    localStorage.removeItem('chronilens_user');
  };

  const toggleDemoMode = (enabled) => {
    enableDemo(enabled);
    setDemoActive(enabled);
    if (enabled) {
      const customUser = { name: 'Custom Health User', email: 'user@chronilens.ai' };
      setUser(customUser);
      setToken('user-custom-token-chronilens');
      localStorage.setItem('chronilens_user', JSON.stringify(customUser));
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        demoActive,
        loading,
        login,
        register,
        logout,
        toggleDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
