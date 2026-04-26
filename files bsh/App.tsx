import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import PrivateLayout from './components/PrivateLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Estoque from './pages/Estoque';
import Promocoes from './pages/Promocoes';
import Caixa from './pages/Caixa';
import Vendas from './pages/Vendas';
import Clientes from './pages/Clientes';
import Financeiro from './pages/Financeiro';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
            <Route path="/produtos"   element={<PrivateLayout><Produtos /></PrivateLayout>} />
            <Route path="/estoque"    element={<PrivateLayout><Estoque /></PrivateLayout>} />
            <Route path="/promocoes"  element={<PrivateLayout><Promocoes /></PrivateLayout>} />
            <Route path="/caixa"      element={<PrivateLayout><Caixa /></PrivateLayout>} />
            <Route path="/vendas"     element={<PrivateLayout><Vendas /></PrivateLayout>} />
            <Route path="/clientes"   element={<PrivateLayout><Clientes /></PrivateLayout>} />
            <Route path="/financeiro" element={<PrivateLayout><Financeiro /></PrivateLayout>} />
            <Route path="/usuarios"   element={<PrivateLayout><Usuarios /></PrivateLayout>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
