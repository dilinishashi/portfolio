import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => sessionStorage.getItem('isLoggedIn') === 'true');
  const navigate = useNavigate();

  const login = (email: string, pass: string) => {
    if (email === 'hasan.bose1@gmail.com' && pass === 'Annoor12') {
      setIsLoggedIn(true);
      sessionStorage.setItem('isLoggedIn', 'true');
      showSuccess("Logged in successfully!");
      navigate('/admin/dashboard');
    } else {
      showError("Invalid credentials. Please try again.");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
    navigate('/admin');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};