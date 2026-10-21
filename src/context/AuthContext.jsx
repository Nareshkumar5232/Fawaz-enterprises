import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getStoredUser());
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function checkAuth() {
      try {
        const current = await authService.getCurrentUser();
        setUser(current);
      } catch (err) {
        console.error('Error verifying auth session', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      const loggedUser = data.user || data;
      setUser(loggedUser);
      addToast(`Welcome back, ${loggedUser.name}!`, 'success');
      return loggedUser;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async ({ name, email, phone, password }) => {
    try {
      const data = await authService.register({ name, email, phone, password });
      const newUser = data.user || data;
      setUser(newUser);
      addToast(`Account created. Welcome to Fawaz Enterprises, ${newUser.name}!`, 'success');
      return newUser;
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    addToast('You have been signed out.', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      addToast('Profile details updated successfully.', 'success');
      return updated;
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      addToast('Password changed successfully.', 'success');
      return res;
    } catch (err) {
      addToast(err.message || 'Failed to change password', 'error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
