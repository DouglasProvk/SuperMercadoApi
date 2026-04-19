// Components (Tailwind)
export { default as Sidebar } from './components/TwSidebar';
export { default as Topbar } from './components/TwTopbar';
export { default as Layout } from './components/TwSidebar';
export { KpiCard } from './components/KpiCard';
export { SalesChart } from './components/SalesChart';
export { AlertsList } from './components/AlertsList';
export { PrivateRoute } from './components/PrivateRoute';

// Pages
export { default as Dashboard } from '../pages/DashboardTailwind';
export { Produtos } from '../pages/Produtos';
export { Estoque } from '../pages/Estoque';
export { Promocoes } from '../pages/Promocoes';
export { Caixa } from '../pages/Caixa';
export { Vendas } from '../pages/Vendas';
export { Usuarios } from '../pages/Usuarios';
export { Login } from '../pages/Login';

// Context
export { AuthProvider, useAuth } from '../contexts/AuthContext';

// Services
export { default as apiService } from '../services/api';

// Types
export * from '../types';
