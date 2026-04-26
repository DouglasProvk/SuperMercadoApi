import React, { useState } from 'react';
import { vendasApi, produtosApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

interface ItemCarrinho { produtoId: number; nome: string; quantidade: number; precoUnitario: number; subtotal: number; }

const Caixa: React.FC = () => {
  const { usuario } = useAuth();
  const [busca, setBusca] = useState('');
  const [venda, setVenda] = useState<any>(null);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [loading, setLoading] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [formFinal, setFormFinal] = useState({ formaPagamento: 'Dinheiro', valorPago: '', desconto: '0', acrescimo: '0' });
  const [showFinal, setShowFinal] = useState(false);
  const [sucesso, setSucesso] = useState('');

  const buscarProduto = async () => {
    if (!busca.trim()) return;
    setLoading(true);
    try {
      let p: any;
      try { p = await produtosApi.listar({ busca, pagina: 1, tamanho: 1 }); p = p.dados?.[0]; } catch {}
      if (!p) { alert('Produto não encontrado'); return; }
      await adicionarProduto(p);
    } finally { setLoading(false); setBusca(''); }
  };

  const adicionarProduto = async (p: any) => {
    let vendaAtual = venda;
    if (!vendaAtual) {
      vendaAtual = await vendasApi.abrir({ supermercadoId: usuario?.supermercadoId || 1, clienteId: null });
      setVenda(vendaAtual);
    }
    const updatedVenda = await vendasApi.adicionarItem(vendaAtual.id, { produtoId: p.id, quantidade: 1, precoUnitario: null, desconto: 0 });
    setVenda(updatedVenda);
    setCarrinho(updatedVenda.itens?.map((it: any) => ({
      produtoId: it.produtoId, nome: it.produtoNome || it.produto,
      quantidade: it.quantidade, precoUnitario: it.precoUnitario, subtotal: it.subtotal,
    })) || []);
  };

  const removerItem = async (itemId: number) => {
    if (!venda) return;
    const updatedVenda = await vendasApi.removerItem(venda.id, itemId);
    setVenda(updatedVenda);
    setCarrinho(updatedVenda.itens?.map((it: any) => ({
      produtoId: it.produtoId, nome: it.produtoNome || it.produto,
      quantidade: it.quantidade, precoUnitario: it.precoUnitario, subtotal: it.subtotal,
    })) || []);
  };

  const finalizar = async () => {
    if (!venda || !carrinho.length) return;
    setFinalizando(true);
    try {
      await vendasApi.finalizar(venda.id, {
        formaPagamento: formFinal.formaPagamento,
        valorPago: Number(formFinal.valorPago),
        desconto: Number(formFinal.desconto),
        acrescimo: Number(formFinal.acrescimo),
      });
      setSucesso(`Venda #${venda.numeroVenda} finalizada com sucesso!`);
      setVenda(null); setCarrinho([]); setShowFinal(false);
      setTimeout(() => setSucesso(''), 5000);
    } catch (e: any) { alert(e?.response?.data?.erro || 'Erro ao finalizar'); }
    finally { setFinalizando(false); }
  };

  const cancelar = async () => {
    if (!venda) return;
    if (!confirm('Cancelar esta venda?')) return;
    await vendasApi.cancelar(venda.id, { motivo: 'Cancelado pelo operador' });
    setVenda(null); setCarrinho([]);
  };

  const subtotal = carrinho.reduce((s, i) => s + i.subtotal, 0);

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Caixa (PDV)</h1></div>

      {sucesso && (
        <div style={{background:'var(--success-dim)',border:'1px solid var(--success)',borderRadius:'var(--radius-sm)',padding:'12px 16px',marginBottom:16,color:'var(--success)',fontWeight:600}}>
          ✅ {sucesso}
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20,alignItems:'start'}}>
        {/* Left - cart */}
        <div>
          {/* Search bar */}
          <div className="card card-pad" style={{marginBottom:16}}>
            <div style={{display:'flex',gap:10}}>
              <input
                className="input"
                placeholder="Buscar produto por nome ou código de barras..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && buscarProduto()}
                style={{flex:1}}
                disabled={loading}
              />
              <button className="btn btn-primary" onClick={buscarProduto} disabled={loading}>{loading ? '...' : 'Adicionar'}</button>
            </div>
          </div>

          {/* Cart items */}
          <div className="card">
            {!carrinho.length ? (
              <div style={{textAlign:'center',padding:'48px 24px',color:'var(--text-muted)'}}>
                <div style={{fontSize:48,marginBottom:12}}>🛒</div>
                <div>Nenhum item adicionado</div>
                <div style={{fontSize:12,marginTop:4}}>Busque um produto acima para começar</div>
              </div>
            ) : (
              <table>
                <thead><tr><th>Produto</th><th>Qtd</th><th>Unitário</th><th>Subtotal</th><th></th></tr></thead>
                <tbody>
                  {venda?.itens?.map((it: any) => (
                    <tr key={it.id}>
                      <td style={{fontWeight:600,fontSize:13}}>{it.produtoNome || it.produto}</td>
                      <td>{it.quantidade}</td>
                      <td>{fmt(it.precoUnitario)}</td>
                      <td style={{fontWeight:700,color:'var(--accent)'}}>{fmt(it.subtotal)}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => removerItem(it.id)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right - summary */}
        <div className="card card-pad" style={{position:'sticky',top:80}}>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,marginBottom:20}}>Resumo</div>

          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'var(--text-secondary)'}}>
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:15,fontWeight:700,borderTop:'1px solid var(--border)',paddingTop:10}}>
              <span>Total</span><span style={{color:'var(--accent)'}}>{fmt(subtotal)}</span>
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <button
              className="btn btn-primary"
              disabled={!carrinho.length}
              onClick={() => setShowFinal(true)}
              style={{width:'100%'}}
            >
              Finalizar Venda
            </button>
            {venda && (
              <button className="btn btn-danger" onClick={cancelar} style={{width:'100%'}}>
                Cancelar Venda
              </button>
            )}
          </div>

          {venda && (
            <div style={{marginTop:16,padding:'8px 12px',background:'var(--bg-elevated)',borderRadius:'var(--radius-sm)',fontSize:11,color:'var(--text-muted)'}}>
              Venda aberta: <strong style={{fontFamily:'monospace',color:'var(--accent)'}}>{venda.numeroVenda}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Finalizar Modal */}
      {showFinal && (
        <div className="modal-backdrop" onClick={() => setShowFinal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Finalizar Venda</span>
              <button className="icon-btn" onClick={() => setShowFinal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{padding:'12px 16px',background:'var(--accent-dim)',borderRadius:'var(--radius-sm)',marginBottom:4}}>
                <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:2}}>Total a pagar</div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:28,color:'var(--accent)'}}>{fmt(subtotal)}</div>
              </div>
              <div className="input-wrap">
                <label className="input-label">Forma de Pagamento</label>
                <select className="input" value={formFinal.formaPagamento} onChange={e => setFormFinal({...formFinal, formaPagamento: e.target.value})}>
                  <option>Dinheiro</option><option>Cartão de Débito</option><option>Cartão de Crédito</option><option>PIX</option><option>Cheque</option>
                </select>
              </div>
              <div className="form-grid">
                <div className="input-wrap">
                  <label className="input-label">Desconto (R$)</label>
                  <input className="input" type="number" step="0.01" value={formFinal.desconto} onChange={e => setFormFinal({...formFinal, desconto: e.target.value})} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Acréscimo (R$)</label>
                  <input className="input" type="number" step="0.01" value={formFinal.acrescimo} onChange={e => setFormFinal({...formFinal, acrescimo: e.target.value})} />
                </div>
              </div>
              <div className="input-wrap">
                <label className="input-label">Valor Pago (R$)</label>
                <input className="input" type="number" step="0.01" value={formFinal.valorPago} onChange={e => setFormFinal({...formFinal, valorPago: e.target.value})} placeholder={String(subtotal)} />
              </div>
              {formFinal.valorPago && Number(formFinal.valorPago) > subtotal && (
                <div style={{padding:'10px 14px',background:'var(--success-dim)',borderRadius:'var(--radius-sm)',fontSize:13,color:'var(--success)',fontWeight:600}}>
                  Troco: {fmt(Number(formFinal.valorPago) - subtotal)}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowFinal(false)}>Voltar</button>
              <button className="btn btn-primary" onClick={finalizar} disabled={finalizando}>{finalizando ? 'Processando...' : 'Confirmar Venda'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Caixa;
