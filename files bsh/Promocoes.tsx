import React, { useEffect, useState, useCallback } from 'react';
import { produtosApi } from '../services/api';

interface Produto { id: number; nome: string; precoVenda: number; precoPromocao?: number; emPromocao: boolean; inicioPromocao?: string; fimPromocao?: string; }
const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const Promocoes: React.FC = () => {
  const [dados, setDados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selecionado, setSelecionado] = useState<Produto | null>(null);
  const [form, setForm] = useState({ emPromocao: true, precoPromocao: '', inicioPromocao: '', fimPromocao: '' });
  const [saving, setSaving] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await produtosApi.listar({ pagina: 1, tamanho: 200 });
      setDados(r.dados || []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const abrir = (p: Produto) => {
    setSelecionado(p);
    setForm({ emPromocao: p.emPromocao, precoPromocao: String(p.precoPromocao || ''), inicioPromocao: p.inicioPromocao?.slice(0,10) || '', fimPromocao: p.fimPromocao?.slice(0,10) || '' });
    setShowModal(true);
  };

  const salvar = async () => {
    if (!selecionado) return;
    setSaving(true);
    try {
      await produtosApi.promocao(selecionado.id, {
        emPromocao: form.emPromocao,
        precoPromocao: form.precoPromocao ? Number(form.precoPromocao) : null,
        inicioPromocao: form.inicioPromocao || null,
        fimPromocao: form.fimPromocao || null,
      });
      setShowModal(false);
      carregar();
    } catch (e: any) { alert(e?.response?.data?.erro || 'Erro'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Promoções</h1>
        <p className="page-subtitle">Gerencie preços promocionais</p>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Produto</th><th>Preço Normal</th><th>Preço Promo</th><th>Vigência</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {loading ? [...Array(8)].map((_,i) => <tr key={i}>{[...Array(6)].map((_,j) => <td key={j}><div className="skeleton" style={{height:14,width:'80%'}} /></td>)}</tr>) :
              dados.map(p => (
                <tr key={p.id}>
                  <td style={{fontWeight:600}}>{p.nome}</td>
                  <td>{fmt(p.precoVenda)}</td>
                  <td>{p.precoPromocao ? <span style={{color:'var(--success)',fontWeight:700}}>{fmt(p.precoPromocao)}</span> : '—'}</td>
                  <td style={{fontSize:12,color:'var(--text-muted)'}}>
                    {p.inicioPromocao ? `${new Date(p.inicioPromocao).toLocaleDateString('pt-BR')} — ${p.fimPromocao ? new Date(p.fimPromocao).toLocaleDateString('pt-BR') : '...'}` : '—'}
                  </td>
                  <td>{p.emPromocao ? <span className="badge badge-green">Ativa</span> : <span className="badge badge-gray">Inativa</span>}</td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => abrir(p)}>✏️ Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Promoção — {selecionado?.nome}</span>
              <button className="icon-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}>
                <input type="checkbox" checked={form.emPromocao} onChange={e => setForm({...form, emPromocao: e.target.checked})} />
                Promoção ativa
              </label>
              <div className="input-wrap">
                <label className="input-label">Preço Promocional</label>
                <input className="input" type="number" step="0.01" value={form.precoPromocao} onChange={e => setForm({...form, precoPromocao: e.target.value})} />
              </div>
              <div className="form-grid">
                <div className="input-wrap">
                  <label className="input-label">Início</label>
                  <input className="input" type="date" value={form.inicioPromocao} onChange={e => setForm({...form, inicioPromocao: e.target.value})} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Fim</label>
                  <input className="input" type="date" value={form.fimPromocao} onChange={e => setForm({...form, fimPromocao: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar} disabled={saving}>{saving ? '...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Promocoes };
export default Promocoes;
