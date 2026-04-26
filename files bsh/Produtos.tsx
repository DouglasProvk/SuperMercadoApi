import React, { useEffect, useState, useCallback } from 'react';
import { produtosApi } from '../services/api';

interface Produto {
  id: number; nome: string; codigoBarras?: string;
  precoVenda: number; precoCusto: number; precoPromocao?: number;
  quantidadeEstoque: number; estoqueMinimo: number;
  categoria?: string; fornecedor?: string;
  ativo: boolean; emPromocao: boolean; estoqueBaixo: boolean;
  vencimentoProximo: boolean; vencido: boolean;
}

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const Produtos: React.FC = () => {
  const [dados, setDados] = useState<Produto[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const POR_PAG = 15;

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await produtosApi.listar({ pagina, tamanho: POR_PAG, busca: busca || undefined });
      setDados(r.dados || []);
      setTotal(r.total || 0);
    } catch { setError('Erro ao carregar produtos'); }
    finally { setLoading(false); }
  }, [pagina, busca]);

  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => { setPagina(1); }, [busca]);

  const abrirNovo = () => {
    setEditando(null);
    setForm({ nome: '', precoVenda: '', precoCusto: '', quantidadeEstoque: '', estoqueMinimo: 5, unidade: 'UN' });
    setShowModal(true);
  };

  const abrirEditar = (p: Produto) => {
    setEditando(p);
    setForm({ ...p });
    setShowModal(true);
  };

  const salvar = async () => {
    setSaving(true);
    try {
      if (editando) {
        await produtosApi.atualizar(editando.id, form);
      } else {
        await produtosApi.criar({ ...form, supermercadoId: 1, diasAvisoValidade: 30 });
      }
      setShowModal(false);
      carregar();
    } catch (e: any) {
      alert(e?.response?.data?.erro || 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  const deletar = async (id: number) => {
    if (!confirm('Deseja inativar este produto?')) return;
    await produtosApi.deletar(id);
    carregar();
  };

  const totalPags = Math.ceil(total / POR_PAG);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Produtos</h1>
          <p className="page-subtitle">{total} produto(s) cadastrado(s)</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>+ Novo Produto</button>
      </div>

      {/* Filters */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="input search-input"
            placeholder="Buscar por nome, código de barras..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço Venda</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(8)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ height: 14, width: '80%' }} /></td>
                  ))}
                </tr>
              )) : dados.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.nome}</div>
                    {p.codigoBarras && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.codigoBarras}</div>}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.categoria || '—'}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{fmt(p.precoVenda)}</div>
                    {p.emPromocao && p.precoPromocao && (
                      <div style={{ fontSize: 11, color: 'var(--success)' }}>{fmt(p.precoPromocao)} promo</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: p.estoqueBaixo ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {p.quantidadeEstoque}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>mín: {p.estoqueMinimo}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.vencido && <span className="badge badge-red">Vencido</span>}
                      {!p.vencido && p.vencimentoProximo && <span className="badge badge-yellow">Vencendo</span>}
                      {p.estoqueBaixo && <span className="badge badge-red">Est. Baixo</span>}
                      {p.emPromocao && <span className="badge badge-blue">Promoção</span>}
                      {!p.vencido && !p.vencimentoProximo && !p.estoqueBaixo && !p.emPromocao && (
                        <span className="badge badge-green">OK</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(p)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deletar(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPags > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {((pagina-1)*POR_PAG)+1}–{Math.min(pagina*POR_PAG, total)} de {total}
            </span>
            <div className="pagination">
              <button className="page-btn" onClick={() => setPagina(p => Math.max(1, p-1))} disabled={pagina === 1}>‹</button>
              {[...Array(Math.min(5, totalPags))].map((_, i) => {
                const pg = i + 1;
                return <button key={pg} className={`page-btn${pagina === pg ? ' active' : ''}`} onClick={() => setPagina(pg)}>{pg}</button>;
              })}
              <button className="page-btn" onClick={() => setPagina(p => Math.min(totalPags, p+1))} disabled={pagina === totalPags}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editando ? 'Editar Produto' : 'Novo Produto'}</span>
              <button className="icon-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="col-span-2 input-wrap">
                  <label className="input-label">Nome *</label>
                  <input className="input" value={form.nome || ''} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Nome do produto" />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Preço de Custo</label>
                  <input className="input" type="number" step="0.01" value={form.precoCusto || ''} onChange={e => setForm({...form, precoCusto: e.target.value})} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Preço de Venda *</label>
                  <input className="input" type="number" step="0.01" value={form.precoVenda || ''} onChange={e => setForm({...form, precoVenda: e.target.value})} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Qtd. Estoque</label>
                  <input className="input" type="number" step="0.001" value={form.quantidadeEstoque || ''} onChange={e => setForm({...form, quantidadeEstoque: e.target.value})} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Estoque Mínimo</label>
                  <input className="input" type="number" step="0.001" value={form.estoqueMinimo || ''} onChange={e => setForm({...form, estoqueMinimo: e.target.value})} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Unidade</label>
                  <select className="input" value={form.unidade || 'UN'} onChange={e => setForm({...form, unidade: e.target.value})}>
                    <option>UN</option><option>KG</option><option>L</option><option>CX</option><option>PC</option>
                  </select>
                </div>
                <div className="input-wrap">
                  <label className="input-label">Código de Barras</label>
                  <input className="input" value={form.codigoBarras || ''} onChange={e => setForm({...form, codigoBarras: e.target.value})} />
                </div>
                <div className="col-span-2 input-wrap">
                  <label className="input-label">Descrição</label>
                  <input className="input" value={form.descricao || ''} onChange={e => setForm({...form, descricao: e.target.value})} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Data de Validade</label>
                  <input className="input" type="date" value={form.dataValidade || ''} onChange={e => setForm({...form, dataValidade: e.target.value})} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Dias Aviso Validade</label>
                  <input className="input" type="number" value={form.diasAvisoValidade || 30} onChange={e => setForm({...form, diasAvisoValidade: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;
