import React, { useEffect, useState } from 'react';
import { estoqueApi, produtosApi } from '../services/api';

interface Mov {
  id: number; produtoId: number; produto: string; tipo: string;
  quantidade: number; quantidadeAntes: number; quantidadeDepois: number;
  motivo?: string; usuario: string; criadoEm: string;
}

const fmtDate = (d: string) => new Date(d).toLocaleString('pt-BR');

const Estoque: React.FC = () => {
  const [movs, setMovs] = useState<Mov[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [produtos, setProdutos] = useState<{ id: number; nome: string }[]>([]);
  const [form, setForm] = useState({ produtoId: '', tipo: 'Entrada', quantidade: '', motivo: '' });
  const [saving, setSaving] = useState(false);

  const carregar = async () => {
    setLoading(true);
    try {
      const r = await estoqueApi.historicoGeral();
      setMovs(r || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    carregar();
    produtosApi.listar({ pagina: 1, tamanho: 200 }).then((r: any) => setProdutos(r.dados || []));
  }, []);

  const movimentar = async () => {
    setSaving(true);
    try {
      await estoqueApi.movimentar({
        produtoId: Number(form.produtoId),
        tipo: form.tipo,
        quantidade: Number(form.quantidade),
        motivo: form.motivo || undefined,
      });
      setShowModal(false);
      setForm({ produtoId: '', tipo: 'Entrada', quantidade: '', motivo: '' });
      carregar();
    } catch (e: any) {
      alert(e?.response?.data?.erro || 'Erro ao movimentar');
    } finally { setSaving(false); }
  };

  const tipoCor = (t: string) => {
    if (t === 'Entrada' || t === 'Devolucao') return 'badge-green';
    if (t === 'Saida' || t === 'Venda') return 'badge-red';
    return 'badge-yellow';
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Estoque</h1>
          <p className="page-subtitle">Histórico de movimentações</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Movimentar</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Qtd</th>
                <th>Antes → Depois</th>
                <th>Motivo</th>
                <th>Usuário</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(10)].map((_, i) => (
                <tr key={i}>{[...Array(7)].map((_, j) => (
                  <td key={j}><div className="skeleton" style={{ height: 14, width: '70%' }} /></td>
                ))}</tr>
              )) : movs.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.produto}</td>
                  <td><span className={`badge ${tipoCor(m.tipo)}`}>{m.tipo}</span></td>
                  <td style={{ fontWeight: 700 }}>{m.quantidade}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    {m.quantidadeAntes} → {m.quantidadeDepois}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{m.motivo || '—'}</td>
                  <td style={{ fontSize: 12 }}>{m.usuario}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fmtDate(m.criadoEm)}</td>
                </tr>
              ))}
              {!loading && !movs.length && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>
                  Nenhuma movimentação encontrada
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Movimentar Estoque</span>
              <button className="icon-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="input-wrap">
                <label className="input-label">Produto *</label>
                <select className="input" value={form.produtoId} onChange={e => setForm({...form, produtoId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div className="form-grid">
                <div className="input-wrap">
                  <label className="input-label">Tipo *</label>
                  <select className="input" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                    <option>Entrada</option>
                    <option>Saida</option>
                    <option>Ajuste</option>
                    <option>Devolucao</option>
                  </select>
                </div>
                <div className="input-wrap">
                  <label className="input-label">Quantidade *</label>
                  <input className="input" type="number" step="0.001" value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} />
                </div>
              </div>
              <div className="input-wrap">
                <label className="input-label">Motivo</label>
                <input className="input" value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} placeholder="Opcional" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={movimentar} disabled={saving}>{saving ? 'Salvando...' : 'Confirmar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estoque;
