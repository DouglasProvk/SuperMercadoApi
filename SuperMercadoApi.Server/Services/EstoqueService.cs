using CommonTemp.DTOs.Input;
using CommonTemp.Models.Sistema;
using SuperMercadoApi.Server.Context;
using SuperMercadoApi.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SuperMercadoApi.Server.Services
{
    public class EstoqueService(AppDbContext db) : IEstoqueService
    {
        public async Task<MovimentacaoDto> MovimentarAsync(MovimentacaoRequest req, int usuarioId)
        {
            var produto = await db.Produtos.FindAsync(req.ProdutoId)
                ?? throw new KeyNotFoundException("Produto não encontrado.");

            var antes = produto.QuantidadeEstoque;

            produto.QuantidadeEstoque = req.Tipo switch
            {
                "Entrada" => antes + req.Quantidade,
                "Saida" => antes - req.Quantidade,
                "Ajuste" => req.Quantidade,
                "Devolucao" => antes + req.Quantidade,
                _ => throw new ArgumentException("Tipo inválido.")
            };
            produto.AtualizadoEm = DateTime.UtcNow;

            var mov = new MovimentacaoEstoque
            {
                ProdutoId = req.ProdutoId,
                UsuarioId = usuarioId,
                Tipo = req.Tipo,
                Quantidade = req.Quantidade,
                QuantidadeAntes = antes,
                QuantidadeDepois = produto.QuantidadeEstoque,
                Motivo = req.Motivo
            };
            db.MovimentacoesEstoque.Add(mov);
            await db.SaveChangesAsync();

            var usuario = await db.Usuarios.FindAsync(usuarioId);
            return new MovimentacaoDto(mov.Id, produto.Id, produto.Nome, mov.Tipo,
                mov.Quantidade, mov.QuantidadeAntes, mov.QuantidadeDepois,
                mov.Motivo, usuario?.Nome ?? "", mov.CriadoEm);
        }

        public async Task<PagedResult<MovimentacaoDto>> HistoricoAsync(int produtoId, int pagina, int tamanho)
        {
            var q = db.MovimentacoesEstoque
                .Include(m => m.Produto)
                .Include(m => m.Usuario)
                .Where(m => m.ProdutoId == produtoId)
                .OrderByDescending(m => m.CriadoEm);

            var total = await q.CountAsync();
            var dados = await q.Skip((pagina - 1) * tamanho).Take(tamanho)
                .Select(m => new MovimentacaoDto(m.Id, m.ProdutoId, m.Produto.Nome,
                    m.Tipo, m.Quantidade, m.QuantidadeAntes, m.QuantidadeDepois,
                    m.Motivo, m.Usuario.Nome, m.CriadoEm))
                .ToListAsync();

            return new PagedResult<MovimentacaoDto>(dados, total, pagina, tamanho);
        }

        public async Task<List<MovimentacaoDto>> HistoricoSupermercadoAsync(
            int supermercadoId, DateTime? de, DateTime? ate)
        {
            return await db.MovimentacoesEstoque
                .Include(m => m.Produto)
                .Include(m => m.Usuario)
                .Where(m => m.Produto.SupermercadoId == supermercadoId &&
                            (de == null || m.CriadoEm >= de) &&
                            (ate == null || m.CriadoEm <= ate))
                .OrderByDescending(m => m.CriadoEm)
                .Take(500)
                .Select(m => new MovimentacaoDto(m.Id, m.ProdutoId, m.Produto.Nome,
                    m.Tipo, m.Quantidade, m.QuantidadeAntes, m.QuantidadeDepois,
                    m.Motivo, m.Usuario.Nome, m.CriadoEm))
                .ToListAsync();
        }
    }
}
