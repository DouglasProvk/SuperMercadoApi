import React, { useEffect, useState, useCallback } from 'react';
import { clientesApi } from '../services/api';

interface Cliente { id: number; nome: string; cpf?: string; email?: string; telefone?: string; pontosAcumulados: number; ativo: boolean; criadoEm: string; }

const Clientes: React.FC = () => {
  const [dados, setDados] = useState<Cliente[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const POR_PAG = 20;

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await clientesApi.listar({ pagina, tamanho: POR_PAG, busca: busca || undefined });
      setDados(r.dados || []); setTotal(r.total || 0);
    } catch {} finally { setLoading(false); }
  }, [pagina, busca]);

  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => { setPagina(1); }, [busca]);

  const abrir = (c?: Cliente) => {
    setEditando(c || null);
    setForm(c ? {...c} : { nome: '', cpf: '', email: '', telefone: '' });
    setShowModal(true);
  };

  const salvar = async () => {
    setSaving(true);
    try {
      if (editando) await clientesApi.atualizar(editando.id, { ...form, supermercadoId: 1 });
      else await clientesApi.criar({ ...form, supermercadoId: 1 });
      setShowModal(false); carregar();
    } catch (e: any) { alert(e?.response?.data?.erro || 'Erro'); }
    finally { setSaving(false); }
  };

  const deletar = async (id: number) => {
    if (!confirm('Inativar este cliente?')) return;
    await clientesApi.deletar(id); carregar();
  };

  const totalPags = Math.ceil(total / POR_PAG);

  return (
    <div>
      <div className="page-header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div><h1 className="page-title">Clientes</h1><p className="page-subtitle">{total} cliente(s)</p></div>
        <button className="btn btn-primary" onClick={() => abrir()}>+ Novo Cliente</button>
      </div>
      <div className="card card-pad" style={{marginBottom:16}}>
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="input search-input" placeholder="Buscar por nome, CPF ou telefone..." value={busca} onChange={e => setBusca(e.target.value)} style={{width:'100%'}} />
        </div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>CPF</th><th>Telefone</th><th>E-mail</th><th>Pontos</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {loading ? [...Array(8)].map((_,i) => <tr key={i}>{[...Array(7)].map((_,j) => <td key={j}><div className="skeleton" style={{height:14,width:'80%'}} /></td>)}</tr>) :
              dados.map(c => (
                <tr key={c.id}>
                  <td style={{fontWeight:600}}>{c.nome}</td>
                  <td style={{fontFamily:'monospace',fontSize:12}}>{c.cpf || '—'}</td>
                  <td style={{fontSize:12}}>{c.telefone || '—'}</td>
                  <td style={{fontSize:12,color:'var(--text-muted)'}}>{c.email || '—'}</td>
                  <td><span className="badge badge-blue">🏆 {c.pontosAcumulados}</span></td>
                  <td><span className={`badge ${c.ativo ? 'badge-green' : 'badge-gray'}`}>{c.ativo ? 'Ativo' : 'Inativo'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-ghost btn-sm" onClick={() => abrir(c)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deletar(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !dados.length && <tr><td colSpan={7} style={{textAlign:'center',color:'var(--text-muted)',padding:'32px 0'}}>Nenhum cliente encontrado</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPags > 1 && (
          <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',padding:'14px 20px',borderTop:'1px solid var(--border-subtle)'}}>
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
            <div className="modal-header">
              <span className="modal-title">{editando ? 'Editar Cliente' : 'Novo Cliente'}</span>
              <button className="icon-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="col-span-2 input-wrap"><label className="input-label">Nome *</label><input className="input" value={form.nome||''} onChange={e=>setForm({...form,nome:e.target.value})} /></div>
                <div className="input-wrap"><label className="input-label">CPF</label><input className="input" value={form.cpf||''} onChange={e=>setForm({...form,cpf:e.target.value})} /></div>
                <div className="input-wrap"><label className="input-label">Telefone</label><input className="input" value={form.telefone||''} onChange={e=>setForm({...form,telefone:e.target.value})} /></div>
                <div className="col-span-2 input-wrap"><label className="input-label">E-mail</label><input className="input" type="email" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                <div className="input-wrap"><label className="input-label">Cidade</label><input className="input" value={form.cidade||''} onChange={e=>setForm({...form,cidade:e.target.value})} /></div>
                <div className="input-wrap"><label className="input-label">Estado</label><input className="input" maxLength={2} value={form.estado||''} onChange={e=>setForm({...form,estado:e.target.value})} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar} disabled={saving}>{saving?'...':'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
