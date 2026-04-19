import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import type { UsuarioDto } from '../types';

interface AuthContextType {
  usuario: UsuarioDto | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [usuario, setUsuario] = React.useState<UsuarioDto | null>(null);
const navigate = useNavigate();

  React.useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      setUsuario(JSON.parse(storedUsuario));
    }
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await apiService.login({ email, senha });
      setUsuario(response.usuario);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setUsuario(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
