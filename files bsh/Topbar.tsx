import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/produtos':  'Produtos',
  '/estoque':   'Estoque',
  '/promocoes': 'Promoções',
  '/caixa':     'Caixa (PDV)',
  '/vendas':    'Vendas',
  '/clientes':  'Clientes',
  '/financeiro':'Financeiro',
  '/usuarios':  'Usuários',
};

interface TopbarProps { onMenuClick?: () => void; }

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const title = PAGE_TITLES[location.pathname] || 'SuperGestão';

  return (
    <header className="topbar">
      <button className="icon-btn md:hidden" onClick={onMenuClick} aria-label="menu">
        ☰
      </button>
      <span className="topbar-title">{title}</span>
      <button className="icon-btn" onClick={toggleTheme} title="Alternar tema">
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </header>
  );
};

export default Topbar;
