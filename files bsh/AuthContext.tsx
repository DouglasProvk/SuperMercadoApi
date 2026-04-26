import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

interface UsuarioDto {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  foto?: string;
  perfil: string;
  permissoes: string[];
  supermercadoId: number;
  supermercado: string;
}

interface AuthContextType {
  usuario: UsuarioDto | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  temPermissao: (p: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioDto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      try { setUsuario(JSON.parse(stored)); } catch { localStorage.clear(); }
    }
  }, []);

  const login = async (email: string, senha: string) => {
    const data = await authApi.login(email, senha);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    navigate('/dashboard');
  };

  const logout = async () => {
    const rt = localStorage.getItem('refreshToken');
    if (rt) { try { await authApi.logout(rt); } catch { /* ignore */ } }
    localStorage.clear();
    setUsuario(null);
    navigate('/login');
  };

  const temPermissao = (p: string) => usuario?.permissoes?.includes(p) ?? false;

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated: !!usuario, temPermissao }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
