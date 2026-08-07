import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data;
      
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      showToast(msg, 'error');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', formData);
      const { token: userToken, ...userData } = res.data;

      setToken(userToken);
      setUser(userData);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      showToast('Account registered successfully!', 'success');
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        toast,
        showToast,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
      {toast && (
        <div className="toast-container">
          <div
            className="toast"
            style={{
              borderColor:
                toast.type === 'error'
                  ? '#ef4444'
                  : toast.type === 'success'
                  ? '#10b981'
                  : '#6366f1',
            }}
          >
            <span style={{ fontWeight: 600 }}>
              {toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✅' : 'ℹ️'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
