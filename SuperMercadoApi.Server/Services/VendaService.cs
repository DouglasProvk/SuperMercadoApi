using CommonTemp.DTOs.Input;
using CommonTemp.Models.Sistema;
using SuperMercadoApi.Server.Context;
using SuperMercadoApi.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SuperMercadoApi.Server.Services
{
    public class VendaService(AppDbContext db) : IVendaService
    {
        public async Task<VendaDto> AbrirVendaAsync(AbrirVendaRequest req, int usuarioId)
        {
            // Número único por supermercado
            var num = $"V{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(100, 999)}";

            var venda = new Venda
            {
                SupermercadoId = req.SupermercadoId,
                ClienteId = req.ClienteId,
                UsuarioId = usuarioId,
                NumeroVenda = num,
                Status = "Aberta"
            };
            db.Vendas.Add(venda);
            await db.SaveChangesAsync();
            return (await ObterPorIdAsync(venda.Id))!;
        }

        public async Task<VendaDto> AdicionarItemAsync(int vendaId, AdicionarItemRequest req)
        {
            var venda = await db.Vendas
                .Include(v => v.Itens)
                .FirstOrDefaultAsync(v => v.Id == vendaId && v.Status == "Aberta")
                ?? throw new InvalidOperationException("Venda não encontrada ou não está aberta.");

            var produto = await db.Produtos.FindAsync(req.ProdutoId)
                ?? throw new KeyNotFoundException("Produto não encontrado.");

            if (produto.QuantidadeEstoque < req.Quantidade)
                throw new InvalidOperationException($"Estoque insuficiente. Disponível: {produto.QuantidadeEstoque}");

            var preco = req.PrecoUnitario ?? produto.PrecoEfetivo;
            var subtotal = (preco * req.Quantidade) - req.Desconto;

            // Verifica se produto já está no carrinho
            var itemExistente = venda.Itens.FirstOrDefault(i => i.ProdutoId == req.ProdutoId);
            if (itemExistente is not null)
            {
                itemExistente.Quantidade += req.Quantidade;
                itemExistente.Desconto += req.Desconto;
                itemExistente.Subtotal = (itemExistente.PrecoUnitario * itemExistente.Quantidade) - itemExistente.Desconto;
            }
            else
            {
                db.ItensVenda.Add(new ItemVenda
                {
                    VendaId = vendaId,
                    ProdutoId = req.ProdutoId,
                    Quantidade = req.Quantidade,
                    PrecoUnitario = preco,
                    Desconto = req.Desconto,
                    Subtotal = subtotal,
                    EmPromocao = produto.EmPromocao
                });
            }

            RecalcularTotais(venda);
            await db.SaveChangesAsync();
            return (await ObterPorIdAsync(vendaId))!;
        }

        public async Task<VendaDto> RemoverItemAsync(int vendaId, int itemId)
        {
            var item = await db.ItensVenda
                .FirstOrDefaultAsync(i => i.Id == itemId && i.VendaId == vendaId)
                ?? throw new KeyNotFoundException("Item não encontrado.");

            db.ItensVenda.Remove(item);

            var venda = await db.Vendas.Include(v => v.Itens)
                .FirstAsync(v => v.Id == vendaId);
            RecalcularTotais(venda);
            await db.SaveChangesAsync();
            return (await ObterPorIdAsync(vendaId))!;
        }

        public async Task<VendaDto> FinalizarAsync(int vendaId, FinalizarVendaRequest req, int usuarioId)
        {
            var venda = await db.Vendas
                .Include(v => v.Itens).ThenInclude(i => i.Produto)
                .FirstOrDefaultAsync(v => v.Id == vendaId && v.Status == "Aberta")
                ?? throw new InvalidOperationException("Venda não encontrada ou não está aberta.");

            if (!venda.Itens.Any())
                throw new InvalidOperationException("A venda não possui itens.");

            venda.Desconto = req.Desconto;
            venda.Acrescimo = req.Acrescimo;
            venda.Subtotal = venda.Itens.Sum(i => i.Subtotal);
            venda.Total = venda.Subtotal - req.Desconto + req.Acrescimo;
            venda.FormaPagamento = req.FormaPagamento;
            venda.ValorPago = req.ValorPago;
            venda.Troco = req.ValorPago > venda.Total ? req.ValorPago - venda.Total : 0;
            venda.Status = "Finalizada";
            venda.FinalizadoEm = DateTime.UtcNow;

            // Baixa automática de estoque
            foreach (var item in venda.Itens)
            {
                var antes = item.Produto.QuantidadeEstoque;
                item.Produto.QuantidadeEstoque -= item.Quantidade;
                item.Produto.AtualizadoEm = DateTime.UtcNow;

                db.MovimentacoesEstoque.Add(new MovimentacaoEstoque
                {
                    ProdutoId = item.ProdutoId,
                    UsuarioId = usuarioId,
                    Tipo = "Venda",
                    Quantidade = item.Quantidade,
                    QuantidadeAntes = antes,
                    QuantidadeDepois = item.Produto.QuantidadeEstoque,
                    Motivo = $"Baixa automática - Venda #{venda.NumeroVenda}",
                    ReferenciaId = venda.Id
                });
            }

            // Gerar conta a receber
            db.Contas.Add(new Conta
            {
                SupermercadoId = venda.SupermercadoId,
                Tipo = "Receber",
                Descricao = $"Venda #{venda.NumeroVenda}",
                Valor = venda.Total,
                DataVencimento = DateOnly.FromDateTime(DateTime.Today),
                DataPagamento = DateOnly.FromDateTime(DateTime.Today),
                Status = "Pago",
                VendaId = venda.Id,
                FormaPagamento = req.FormaPagamento,
                ClienteId = venda.ClienteId
            });

            await db.SaveChangesAsync();
            return (await ObterPorIdAsync(vendaId))!;
        }

        public async Task<VendaDto> CancelarAsync(int vendaId, CancelarVendaRequest req, int usuarioId)
        {
            var venda = await db.Vendas
                .FirstOrDefaultAsync(v => v.Id == vendaId && v.Status != "Cancelada")
                ?? throw new InvalidOperationException("Venda não pode ser cancelada.");

            venda.Status = "Cancelada";
            venda.CanceladoEm = DateTime.UtcNow;
            venda.CanceladoPor = usuarioId;
            venda.MotivoCancelamento = req.Motivo;
            await db.SaveChangesAsync();
            return (await ObterPorIdAsync(vendaId))!;
        }

        public async Task<VendaDto?> ObterPorIdAsync(int id)
        {
            var v = await db.Vendas
                .Include(v => v.Cliente)
                .Include(v => v.Usuario)
                .Include(v => v.Itens).ThenInclude(i => i.Produto)
                .FirstOrDefaultAsync(v => v.Id == id);

            return v is null ? null : MapToDto(v);
        }

        public async Task<PagedResult<VendaDto>> ListarAsync(int supermercadoId, int pagina, int tamanho,
            string? status, DateTime? de, DateTime? ate, int? clienteId)
        {
            var q = db.Vendas
                .Include(v => v.Cliente)
                .Include(v => v.Usuario)
                .Include(v => v.Itens).ThenInclude(i => i.Produto)
                .Where(v => v.SupermercadoId == supermercadoId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status)) q = q.Where(v => v.Status == status);
            if (de.HasValue) q = q.Where(v => v.CriadoEm >= de);
            if (ate.HasValue) q = q.Where(v => v.CriadoEm <= ate);
            if (clienteId.HasValue) q = q.Where(v => v.ClienteId == clienteId);

            var total = await q.CountAsync();
            var dados = await q.OrderByDescending(v => v.CriadoEm)
                .Skip((pagina - 1) * tamanho).Take(tamanho)
                .ToListAsync();

            return new PagedResult<VendaDto>(dados.Select(MapToDto).ToList(), total, pagina, tamanho);
        }

        private static void RecalcularTotais(Venda venda)
        {
            venda.Subtotal = venda.Itens.Sum(i => i.Subtotal);
            venda.Total = venda.Subtotal - venda.Desconto + venda.Acrescimo;
        }

        private static VendaDto MapToDto(Venda v) => new(
            v.Id, v.NumeroVenda, v.Status,
            v.ClienteId, v.Cliente?.Nome,
            v.Usuario.Nome,
            v.Subtotal, v.Desconto, v.Acrescimo, v.Total,
            v.FormaPagamento, v.ValorPago, v.Troco,
            v.Itens.Select(i => new ItemVendaDto(
                i.Id, i.ProdutoId, i.Produto.Nome,
                i.Quantidade, i.PrecoUnitario,
                i.Desconto, i.Subtotal, i.EmPromocao)).ToList(),
            v.CriadoEm, v.FinalizadoEm);
    }
}
