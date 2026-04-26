import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { dashboardApi } from '../services/api';

interface DashData {
  vendasHoje: number; qtdVendasHoje: number;
  vendasMes: number; totalProdutos: number;
  produtosEstoqueBaixo: number; produtosVencendo: number;
  totalClientes: number; contasVencer7Dias: number;
  graficoVendas: { data: string; total: number; qtd: number }[];
  alertas: { tipo: string; mensagem: string; nivel: string }[];
}

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const KPI: React.FC<{ label: string; value: string | number; sub?: string; color?: string; icon: string }> = ({ label, value, sub, color = 'var(--accent)', icon }) => (
  <div className="kpi-card">
    <div className="kpi-header">
      <span className="kpi-label">{label}</span>
      <div className="kpi-icon" style={{ background: `${color}20`, fontSize: 18 }}>{icon}</div>
    </div>
    <div className="kpi-value">{value}</div>
    {sub && <div className="kpi-sub">{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding: '10px 14px', fontSize: 13 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--accent)', fontWeight: 700 }}>{fmt(payload[0].value)}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{payload[0].payload.qtd} venda(s)</div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.get()
      .then(setData)
      .catch(() => setError('Erro ao carregar dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <div className="page-header">
        <div className="skeleton" style={{ width: 180, height: 32, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 260, height: 16 }} />
      </div>
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="kpi-card">
            <div className="skeleton" style={{ width: '60%', height: 14 }} />
            <div className="skeleton" style={{ width: '40%', height: 32, marginTop: 12 }} />
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="card card-pad" style={{ color: 'var(--danger)' }}>{error}</div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral do seu supermercado</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <KPI label="Produtos Ativos" value={data?.totalProdutos ?? 0} icon="📦" />
        <KPI
          label="Vendas Hoje"
          value={data?.qtdVendasHoje ?? 0}
          sub={fmt(data?.vendasHoje ?? 0)}
          color="#4dabf7"
          icon="🛒"
        />
        <KPI
          label="Estoque Baixo"
          value={data?.produtosEstoqueBaixo ?? 0}
          color="var(--danger)"
          icon="⚠️"
        />
        <KPI
          label="Em Promoção"
          value={data?.produtosVencendo ?? 0}
          color="var(--warning)"
          icon="🏷️"
        />
        <KPI
          label="Vendas do Mês"
          value={fmt(data?.vendasMes ?? 0)}
          color="#a78bfa"
          icon="📈"
        />
        <KPI label="Total Clientes" value={data?.totalClientes ?? 0} color="#f472b6" icon="👥" />
        <KPI
          label="Contas Vencer (7d)"
          value={fmt(data?.contasVencer7Dias ?? 0)}
          color="var(--danger)"
          icon="💸"
        />
      </div>

      {/* Chart + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Chart */}
        <div className="card card-pad">
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 20, fontSize: 15 }}>
            Vendas — Últimos 7 dias
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data?.graficoVendas ?? []} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="data" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)' }} />
              <Bar dataKey="total" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, margin: 0 }}>Alertas</h3>
            {(data?.alertas?.length ?? 0) > 0 && (
              <span className="badge badge-red">{data!.alertas.length}</span>
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 280 }}>
            {!data?.alertas?.length ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', fontSize: 13 }}>
                ✅ Sem alertas no momento
              </div>
            ) : (
              data.alertas.map((a, i) => (
                <div key={i} className={`alert-item alert-${a.nivel === 'danger' ? 'danger' : 'warning'}`}>
                  <span style={{ fontSize: 14 }}>{a.nivel === 'danger' ? '🔴' : '🟡'}</span>
                  <div>
                    <div className="alert-msg">{a.mensagem}</div>
                    <div className="alert-sub">{a.tipo}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
