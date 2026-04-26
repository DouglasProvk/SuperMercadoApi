import React, { useEffect, useState, useCallback } from 'react';
import { financeiroApi } from '../services/api';

interface Conta { id: number; tipo: string; descricao: string; valor: number; dataVencimento: string; dataPagamento?: string; status: string; formaPagamento?: string; fornecedor?: string; cliente?: string; observacoes?: string; }

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');

const statusBadge = (s: string) => s === 'Pago' ? 'badge-green' : s === 'Cancelado' ? 'badge-gray' : 'badge-yellow';
const tipoBadge = (t: string) => t === 'Receber' ? 'badge-green' : 'badge-red';

const Financeiro: React.FC = () => {
  const [dados, setDados] = useState<Conta[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPagarModal, setShowPagarModal] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState<Conta | null>(null);
  const [form, setForm] = useState<any>({ tipo: 'Pagar', descricao: '', valor: '', dataVencimento: '' });
  const [formPagar, setFormPagar] = useState({ dataPagamento: new Date().toISOString().slice(0,10), formaPagamento: 'Dinheiro' });
  const [saving, setSaving] = useState(false);
  const POR_PAG = 20;

  const carregar = useCallback(async () => {
    setLoading(true);
    try { const r = await financeiroApi.listar({ pagina, tamanho: POR_PAG }); setDados(r.dados || []); setTotal(r.total || 0); }
    catch {} finally { setLoading(false); }
  }, [pagina]);

  useEffect(() => { carregar(); }, [carregar]);

  const salvar = async () => {
    setSaving(true);
    try {
      await financeiroApi.criar({ ...form, supermercadoId: 1, valor: Number(form.valor) });
      setShowModal(false); carregar();
    } catch (e: any) { alert(e?.response?.data?.erro || 'Erro'); }
    finally { setSaving(false); }
  };

  const pagar = async () => {
    if (!contaSelecionada) return;
    setSaving(true);
    try {
      await financeiroApi.pagar(contaSelecionada.id, formPagar);
      setShowPagarModal(false); carregar();
    } catch (e: any) { alert(e?.response?.data?.erro || 'Erro'); }
    finally { setSaving(false); }
  };

  const totalReceber = dados.filter(c => c.tipo === 'Receber' && c.status === 'Pendente').reduce((s,c) => s+c.valor, 0);
  const totalPagar = dados.filter(c => c.tipo === 'Pagar' && c.status === 'Pendente').reduce((s,c) => s+c.valor, 0);
  const totalPags = Math.ceil(total / POR_PAG);

  return (
    <div>
      <div className="page-header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div><h1 className="page-title">Financeiro</h1><p className="page-subtitle">Contas a pagar e receber</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nova Conta</button>
      </div>

      <div className="kpi-grid" style={{marginBottom:20}}>
        <div className="kpi-card"><div className="kpi-header"><span className="kpi-label">A Receber</span><span style={{fontSize:20}}>💰</span></div><div className="kpi-value" style={{color:'var(--success)'}}>{fmt(totalReceber)}</div></div>
        <div className="kpi-card"><div className="kpi-header"><span className="kpi-label">A Pagar</span><span style={{fontSize:20}}>💸</span></div><div className="kpi-value" style={{color:'var(--danger)'}}>{fmt(totalPagar)}</div></div>
        <div className="kpi-card"><div className="kpi-header"><span className="kpi-label">Saldo Líquido</span><span style={{fontSize:20}}>📊</span></div><div className="kpi-value" style={{color: totalReceber-totalPagar >= 0 ? 'var(--success)' : 'var(--danger)'}}>{fmt(totalReceber-totalPagar)}</div></div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tipo</th><th>Descrição</th><th>Valor</th><th>Vencimento</th><th>Pagamento</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {loading ? [...Array(10)].map((_,i) => <tr key={i}>{[...Array(7)].map((_,j) => <td key={j}><div className="skeleton" style={{height:14,width:'80%'}} /></td>)}</tr>) :
              dados.map(c => (
                <tr key={c.id}>
                  <td><span className={`badge ${tipoBadge(c.tipo)}`}>{c.tipo}</span></td>
                  <td style={{fontWeight:600,fontSize:13}}>{c.descricao}</td>
                  <td style={{fontWeight:700,color: c.tipo==='Receber'?'var(--success)':'var(--danger)'}}>{fmt(c.valor)}</td>
                  <td style={{fontSize:12}}>{fmtDate(c.dataVencimento)}</td>
                  <td style={{fontSize:12,color:'var(--text-muted)'}}>{c.dataPagamento ? fmtDate(c.dataPagamento) : '—'}</td>
                  <td><span className={`badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                  <td>
                    {c.status === 'Pendente' && (
                      <button className="btn btn-primary btn-sm" onClick={() => { setContaSelecionada(c); setShowPagarModal(true); }}>Pagar</button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && !dados.length && <tr><td colSpan={7} style={{textAlign:'center',color:'var(--text-muted)',padding:'32px 0'}}>Nenhuma conta encontrada</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPags > 1 && (
          <div style={{display:'flex',justifyContent:'flex-end',padding:'14px 20px',borderTop:'1px solid var(--border-subtle)'}}>
            <div className="pagination">
              <button className="page-btn" onClick={() => setPagina(p => Math.max(1,p-1))} disabled={pagina===1}>‹</button>
              {[...Array(Math.min(5,totalPags))].map((_,i) => <button key={i+1} className={`page-btn${pagina===i+1?' active':''}`} onClick={() => setPagina(i+1)}>{i+1}</button>)}
              <button className="page-btn" onClick={() => setPagina(p => Math.min(totalPags,p+1))} disabled={pagina===totalPags}>›</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Nova Conta</span><button className="icon-btn" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="input-wrap"><label className="input-label">Tipo *</label>
                  <select className="input" value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}><option>Pagar</option><option>Receber</option></select>
                </div>
                <div className="input-wrap"><label className="input-label">Valor *</label><input className="input" type="number" step="0.01" value={form.valor} onChange={e=>setForm({...form,valor:e.target.value})} /></div>
                <div className="col-span-2 input-wrap"><label className="input-label">Descrição *</label><input className="input" value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} /></div>
                <div className="input-wrap"><label className="input-label">Data Vencimento *</label><input className="input" type="date" value={form.dataVencimento} onChange={e=>setForm({...form,dataVencimento:e.target.value})} /></div>
                <div className="input-wrap"><label className="input-label">Forma Pagamento</label>
                  <select className="input" value={form.formaPagamento||''} onChange={e=>setForm({...form,formaPagamento:e.target.value})}><option value="">—</option><option>Dinheiro</option><option>PIX</option><option>Cartão</option><option>Cheque</option><option>Boleto</option></select>
                </div>
                <div className="col-span-2 input-wrap"><label className="input-label">Observações</label><input className="input" value={form.observacoes||''} onChange={e=>setForm({...form,observacoes:e.target.value})} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar} disabled={saving}>{saving?'...':'Salvar'}</button>
            </div>
          </div>
        </div>
      )}

      {showPagarModal && contaSelecionada && (
        <div className="modal-backdrop" onClick={() => setShowPagarModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Registrar Pagamento</span><button className="icon-btn" onClick={() => setShowPagarModal(false)}>✕</button></div>
            <div className="modal-body">
              <div style={{padding:'12px 16px',background:'var(--accent-dim)',borderRadius:'var(--radius-sm)',marginBottom:4}}>
                <div style={{fontSize:12,color:'var(--text-muted)'}}>{contaSelecionada.descricao}</div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:24,color:'var(--accent)'}}>{fmt(contaSelecionada.valor)}</div>
              </div>
              <div className="form-grid">
                <div className="input-wrap"><label className="input-label">Data Pagamento</label><input className="input" type="date" value={formPagar.dataPagamento} onChange={e=>setFormPagar({...formPagar,dataPagamento:e.target.value})} /></div>
                <div className="input-wrap"><label className="input-label">Forma</label>
                  <select className="input" value={formPagar.formaPagamento} onChange={e=>setFormPagar({...formPagar,formaPagamento:e.target.value})}><option>Dinheiro</option><option>PIX</option><option>Cartão</option><option>Cheque</option><option>Boleto</option></select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowPagarModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={pagar} disabled={saving}>{saving?'...':'Confirmar Pagamento'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financeiro;
