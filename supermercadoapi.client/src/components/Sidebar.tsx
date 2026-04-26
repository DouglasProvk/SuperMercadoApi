import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/produtos',  label: 'Produtos',  icon: '📦' },
  { to: '/estoque',   label: 'Estoque',   icon: '📊' },
  { to: '/promocoes', label: 'Promoções', icon: '🏷️' },
  { to: '/caixa',     label: 'Caixa (PDV)', icon: '🛒' },
  { to: '/vendas',    label: 'Vendas',    icon: '📈' },
  { to: '/clientes',  label: 'Clientes',  icon: '👥' },
  { to: '/financeiro',label: 'Financeiro',icon: '💰' },
  { to: '/usuarios',  label: 'Usuários',  icon: '👤' },
];

interface SidebarProps { open?: boolean; onClose?: () => void; }

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { usuario, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">SG</div>
          <div className="brand-text">
            <span className="brand-name">SuperGestão</span>
            <span className="brand-sub">{usuario?.supermercado || 'Sistema de Gestão'}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={onClose}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}

          <div className="nav-section-label" style={{ marginTop: 12 }}>Sistema</div>
          <div
            className="nav-item"
            onClick={toggleTheme}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
            {isDark ? 'Tema Claro' : 'Tema Escuro'}
          </div>
          <div
            className="nav-item"
            onClick={() => { logout(); }}
            style={{ cursor: 'pointer', color: 'var(--danger)' }}
          >
            <span style={{ fontSize: 16 }}>🚪</span>
            Sair
          </div>
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="user-avatar">
            {usuario?.nome?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {usuario?.nome}
            </div>
            <div className="user-role">{usuario?.perfil}</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
