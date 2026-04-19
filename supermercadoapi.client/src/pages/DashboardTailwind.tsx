import React from 'react';
import TwSidebar from '../components/TwSidebar';
import { KpiCard } from '../components/KpiCard';
import { SalesChart } from '../components/SalesChart';
import { AlertsList } from '../components/AlertsList';
import apiService from '../services/api';
import { DashboardDto } from '../types';

export const DashboardTailwind: React.FC = () => {
  const [dashboard, setDashboard] = React.useState<DashboardDto | null>(null);

  React.useEffect(() => {
    apiService.getDashboard().then(setDashboard).catch(() => {});
  }, []);

  return (
    <div className="app-shell">
      <TwSidebar />

      <div className="ml-64 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Visão geral do seu negócio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="kpi-card">Vendas Hoje</div>
          <div className="kpi-card">Faturamento do Mês</div>
          <div className="kpi-card">Total de Produtos</div>
          <div className="kpi-card">Total de Clientes</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <SalesChart data={dashboard?.graficoVendas || []} type="line" height={320} />
            </div>
          </div>
          <div>
            <div className="alerts-card">{dashboard && <AlertsList alertas={dashboard.alertas} />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTailwind;
