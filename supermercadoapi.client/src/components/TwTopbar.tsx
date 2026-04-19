import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const TwTopbar: React.FC<{ onMenuOpen?: () => void }> = ({ onMenuOpen }) => {
  const { usuario, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 ml-64">
      <button className="md:hidden mr-4" onClick={onMenuOpen} aria-label="Abrir menu">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1" />
      {usuario && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="font-semibold">{usuario.nome}</div>
            <div className="text-xs text-gray-500">{usuario.supermercadoNome}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">{usuario.nome?.charAt(0)}</div>
        </div>
      )}
    </header>
  );
};

export default TwTopbar;
