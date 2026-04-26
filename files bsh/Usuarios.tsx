import React, { useEffect, useState, useCallback } from 'react';
import { usuariosApi } from '../services/api';

interface Usuario { id: number; nome: string; email: string; perfil: string; telefone?: string; permissoes: string[]; supermercado: string; }

const Usuarios: React.FC = () => {
  const [dados, setDados] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({ nome: '', email: '', senha: '', perfilId: 1, telefone: '' });
  const [saving, setSaving] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try { const r = await usuariosApi.listar(); setDados(r || []); }
    catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const salvar = async () => {
    setSaving(true);
    try {
      await usuariosApi.criar({ ...form, supermercadoId: 1, perfilId: Number(form.perfilId) });
      setShowModal(false);
      setForm({ nome: '', email: '', senha: '', perfilId: 1, telefone: '' });
      carregar();
    } catch (e: any) { alert(e?.response?.data?.erro || 'Erro'); }
    finally { setSaving(false); }
  };

  const deletar = async (id: number) => {
    if (!confirm('Inativar este usuário?')) return;
    await usuariosApi.deletar(id); carregar();
  };

  const PERFIS: Record<number, { label: string; desc: string; color: string }> = {
    1: { label: 'Administrador', desc: 'Acesso total ao sistema', color: 'badge-red' },
    2: { label: 'Gerente', desc: 'Dashboard, produtos, promoções, vendas', color: 'badge-blue' },
    3: { label: 'Vendedor', desc: 'Apenas PDV (Caixa)', color: 'badge-yellow' },
    4: { label: 'Estoquista', desc: 'Produtos e estoque', color: 'badge-green' },
  };

  return (
    <div>
      <div className="page-header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div><h1 className="page-title">Usuários</h1><p className="page-subtitle">Gerencie os colaboradores do sistema</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Convidar Usuário</button>
      </div>

      {/* Role cards */}
      <div className="kpi-grid" style={{marginBottom:20}}>
        {Object.entries(PERFIS).map(([id, p]) => {
          const count = dados.filter(u => u.perfil === p.label).length;
          return (
            <div key={id} className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">{p.label}</span>
                <span className={`badge ${p.color}`}>{count}</span>
              </div>
              <div style={{fontSize:11,color:'var(--text-muted)',marginTop:4}}>{p.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Telefone</th><th>Ações</th></tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_,i) => <tr key={i}>{[...Array(5)].map((_,j) => <td key={j}><div className="skeleton" style={{height:14,width:'80%'}} /></td>)}</tr>) :
              dados.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div className="user-avatar" style={{flexShrink:0}}>{u.nome.charAt(0)}</div>
                      <span style={{fontWeight:600}}>{u.nome}</span>
                    </div>
                  </td>
                  <td style={{color:'var(--text-muted)',fontSize:13}}>{u.email}</td>
                  <td>
                    {Object.entries(PERFIS).map(([id, p]) => u.perfil === p.label ? <span key={id} className={`badge ${p.color}`}>{p.label}</span> : null)}
                  </td>
                  <td style={{fontSize:12}}>{u.telefone || '—'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => deletar(u.id)}>Inativar</button></td>
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
              <span className="modal-title">Novo Usuário</span>
              <button className="icon-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="col-span-2 input-wrap"><label className="input-label">Nome *</label><input className="input" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} /></div>
                <div className="col-span-2 input-wrap"><label className="input-label">E-mail *</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                <div className="col-span-2 input-wrap"><label className="input-label">Senha *</label><input className="input" type="password" value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})} /></div>
                <div className="input-wrap"><label className="input-label">Perfil *</label>
                  <select className="input" value={form.perfilId} onChange={e=>setForm({...form,perfilId:e.target.value})}>
                    {Object.entries(PERFIS).map(([id,p]) => <option key={id} value={id}>{p.label}</option>)}
                  </select>
                </div>
                <div className="input-wrap"><label className="input-label">Telefone</label><input className="input" value={form.telefone} onChange={e=>setForm({...form,telefone:e.target.value})} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar} disabled={saving}>{saving?'...':'Criar Usuário'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
