import React, { useEffect, useState, useCallback } from 'react';
import { vendasApi } from '../services/api';

interface Venda {
  id: number; numeroVenda: string; status: string;
  clienteNome?: string; usuarioNome: string;
  total: number; subtotal: number; desconto: number;
  formaPagamento?: string; criadoEm: string; finalizadoEm?: string;
  itens: any[];
}

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const fmtDate = (d: string) => new Date(d).toLocaleString('pt-BR');

const statusBadge = (s: string) => {
  if (s === 'Finalizada') return 'badge-green';
  if (s === 'Cancelada')  return 'badge-red';
  return 'badge-yellow';
};

const Vendas: React.FC = () => {
  const [dados, setDados] = useState<Venda[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detalhes, setDetalhes] = useState<Venda | null>(null);
  const POR_PAG = 20;

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const r = await vendasApi.listar({ pagina, tamanho: POR_PAG });
      setDados(r.dados || []);
      setTotal(r.total || 0);
    } catch {} finally { setLoading(false); }
  }, [pagina]);

  useEffect(() => { carregar(); }, [carregar]);

  const totalPags = Math.ceil(total / POR_PAG);

  return (
    <div>
      <div className="page-header" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <h1 className="page-title">Vendas</h1>
          <p className="page-subtitle">{total} venda(s) registrada(s)</p>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nº Venda</th><th>Cliente</th><th>Operador</th>
                <th>Total</th><th>Pagamento</th><th>Status</th>
                <th>Data</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(10)].map((_,i) => <tr key={i}>{[...Array(8)].map((_,j) => <td key={j}><div className="skeleton" style={{height:14,width:'80%'}} /></td>)}</tr>) :
              dados.map(v => (
                <tr key={v.id}>
                  <td style={{fontWeight:700,fontFamily:'monospace'}}>{v.numeroVenda}</td>
                  <td style={{fontSize:13}}>{v.clienteNome || 'Consumidor Final'}</td>
                  <td style={{fontSize:12,color:'var(--text-muted)'}}>{v.usuarioNome}</td>
                  <td style={{fontWeight:700,color:'var(--accent)'}}>{fmt(v.total)}</td>
                  <td style={{fontSize:12}}>{v.formaPagamento || '—'}</td>
                  <td><span className={`badge ${statusBadge(v.status)}`}>{v.status}</span></td>
                  <td style={{fontSize:12,color:'var(--text-muted)'}}>{fmtDate(v.criadoEm)}</td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => setDetalhes(v)}>👁️</button></td>
                </tr>
              ))}
              {!loading && !dados.length && <tr><td colSpan={8} style={{textAlign:'center',color:'var(--text-muted)',padding:'32px 0'}}>Nenhuma venda encontrada</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPags > 1 && (
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderTop:'1px solid var(--border-subtle)'}}>
            <span style={{fontSize:12,color:'var(--text-muted)'}}>{total} registros</span>
            <div className="pagination">
              <button className="page-btn" onClick={() => setPagina(p => Math.max(1,p-1))} disabled={pagina===1}>‹</button>
              {[...Array(Math.min(5,totalPags))].map((_,i) => <button key={i+1} className={`page-btn${pagina===i+1?' active':''}`} onClick={() => setPagina(i+1)}>{i+1}</button>)}
              <button className="page-btn" onClick={() => setPagina(p => Math.min(totalPags,p+1))} disabled={pagina===totalPags}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Detalhe Modal */}
      {detalhes && (
        <div className="modal-backdrop" onClick={() => setDetalhes(null)}>
          <div className="modal" style={{maxWidth:600}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Venda #{detalhes.numeroVenda}</span>
              <button className="icon-btn" onClick={() => setDetalhes(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,fontSize:13}}>
                <div><span style={{color:'var(--text-muted)'}}>Status: </span><span className={`badge ${statusBadge(detalhes.status)}`}>{detalhes.status}</span></div>
                <div><span style={{color:'var(--text-muted)'}}>Pagamento: </span>{detalhes.formaPagamento || '—'}</div>
                <div><span style={{color:'var(--text-muted)'}}>Cliente: </span>{detalhes.clienteNome || 'Consumidor Final'}</div>
                <div><span style={{color:'var(--text-muted)'}}>Operador: </span>{detalhes.usuarioNome}</div>
                <div><span style={{color:'var(--text-muted)'}}>Subtotal: </span>{fmt(detalhes.subtotal)}</div>
                <div><span style={{color:'var(--text-muted)'}}>Desconto: </span>{fmt(detalhes.desconto)}</div>
                <div style={{gridColumn:'span 2',fontWeight:700,fontSize:16}}>
                  Total: <span style={{color:'var(--accent)'}}>{fmt(detalhes.total)}</span>
                </div>
              </div>
              {detalhes.itens?.length > 0 && (
                <div>
                  <div style={{fontWeight:600,marginBottom:8,fontSize:13}}>Itens ({detalhes.itens.length})</div>
                  <div className="table-wrap" style={{border:'1px solid var(--border)',borderRadius:'var(--radius-sm)'}}>
                    <table>
                      <thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Subtotal</th></tr></thead>
                      <tbody>
                        {detalhes.itens.map((it:any) => (
                          <tr key={it.id}>
                            <td style={{fontSize:12}}>{it.produtoNome || it.produto}</td>
                            <td style={{fontSize:12}}>{it.quantidade}</td>
                            <td style={{fontSize:12}}>{fmt(it.precoUnitario)}</td>
                            <td style={{fontSize:12,fontWeight:600}}>{fmt(it.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendas;
