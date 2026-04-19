import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import TwTopbar from './components/TwTopbar';
import TwSidebar from './components/TwSidebar';

// Pages (Tailwind versions)
import DashboardTailwind from './pages/DashboardTailwind';
import Login from './pages/Login';
import Produtos from './pages/Produtos';
import Estoque from './pages/Estoque';
import Promocoes from './pages/Promocoes';
import Caixa from './pages/Caixa';
import Vendas from './pages/Vendas';
import Usuarios from './pages/Usuarios';

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TwSidebar />
      <TwTopbar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><PrivateLayout><DashboardTailwind /></PrivateLayout></PrivateRoute>} />
      <Route path="/produtos" element={<PrivateRoute><PrivateLayout><Produtos /></PrivateLayout></PrivateRoute>} />
      <Route path="/estoque" element={<PrivateRoute><PrivateLayout><Estoque /></PrivateLayout></PrivateRoute>} />
      <Route path="/promocoes" element={<PrivateRoute><PrivateLayout><Promocoes /></PrivateLayout></PrivateRoute>} />
      <Route path="/caixa" element={<PrivateRoute><PrivateLayout><Caixa /></PrivateLayout></PrivateRoute>} />
      <Route path="/vendas" element={<PrivateRoute><PrivateLayout><Vendas /></PrivateLayout></PrivateRoute>} />
      <Route path="/usuarios" element={<PrivateRoute><PrivateLayout><Usuarios /></PrivateLayout></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
