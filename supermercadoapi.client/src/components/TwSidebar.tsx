import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', to: '/dashboard-tailwind' },
  { label: 'Produtos', to: '/produtos' },
  { label: 'Estoque', to: '/estoque' },
  { label: 'Promoções', to: '/promocoes' },
  { label: 'Caixa (PDV)', to: '/caixa' },
  { label: 'Vendas', to: '/vendas' },
  { label: 'Usuários', to: '/usuarios' },
];

export const TwSidebar: React.FC = () => {
  const loc = useLocation();

  return (
    <aside className="w-64 h-screen bg-base-100 border-r border-gray-200 fixed">
      <div className="p-4 sidebar-brand flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-primary">S</div>
        <div>
          <div className="text-white font-bold">SuperGestão</div>
          <div className="text-white text-xs opacity-90">Sistema de Gestão</div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="menu">
          {menu.map((m) => (
            <li key={m.to} className={loc.pathname === m.to ? 'bg-primary/10 rounded-md' : ''}>
              <Link to={m.to} className="flex items-center gap-3 p-2">
                <span className="ml-1">{m.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">A</div>
          <div>
            <div className="font-semibold">Administrador</div>
            <div className="text-xs text-gray-500">Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default TwSidebar;
