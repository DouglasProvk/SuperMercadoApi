using CommonTemp.DTOs.Input;
using CommonTemp.Models.Sistema;
using SuperMercadoApi.Server.Context;
using SuperMercadoApi.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SuperMercadoApi.Server.Services
{
    public class FinanceiroService(AppDbContext db) : IFinanceiroService
    {
        public async Task<PagedResult<ContaDto>> ListarAsync(int supermercadoId, int pagina, int tamanho,
            string? tipo, string? status, DateOnly? de, DateOnly? ate)
        {
            var q = db.Contas
                .Include(c => c.Fornecedor)
                .Include(c => c.Cliente)
                .Where(c => c.SupermercadoId == supermercadoId).AsQueryable();

            if (!string.IsNullOrEmpty(tipo)) q = q.Where(c => c.Tipo == tipo);
            if (!string.IsNullOrEmpty(status)) q = q.Where(c => c.Status == status);
            if (de.HasValue) q = q.Where(c => c.DataVencimento >= de);
            if (ate.HasValue) q = q.Where(c => c.DataVencimento <= ate);

            var total = await q.CountAsync();
            var dados = await q.OrderBy(c => c.DataVencimento).Skip((pagina - 1) * tamanho).Take(tamanho)
                .Select(c => MapToDto(c)).ToListAsync();
            return new PagedResult<ContaDto>(dados, total, pagina, tamanho);
        }

        public async Task<ContaDto> CriarAsync(CriarContaRequest req)
        {
            var conta = new Conta
            {
                SupermercadoId = req.SupermercadoId,
                Tipo = req.Tipo,
                Descricao = req.Descricao,
                Valor = req.Valor,
                DataVencimento = req.DataVencimento,
                FornecedorId = req.FornecedorId,
                ClienteId = req.ClienteId,
                FormaPagamento = req.FormaPagamento,
                Observacoes = req.Observacoes
            };
            db.Contas.Add(conta);
            await db.SaveChangesAsync();
            return MapToDto(conta);
        }

        public async Task<ContaDto> PagarAsync(int id, PagarContaRequest req)
        {
            var conta = await db.Contas.FindAsync(id) ?? throw new KeyNotFoundException();
            conta.Status = "Pago";
            conta.DataPagamento = req.DataPagamento;
            conta.FormaPagamento = req.FormaPagamento ?? conta.FormaPagamento;
            conta.AtualizadoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return MapToDto(conta);
        }

        public async Task DeletarAsync(int id)
        {
            var conta = await db.Contas.FindAsync(id) ?? throw new KeyNotFoundException();
            conta.Status = "Cancelado";
            conta.AtualizadoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        private static ContaDto MapToDto(Conta c) => new(
            c.Id, c.Tipo, c.Descricao, c.Valor, c.DataVencimento, c.DataPagamento,
            c.Status, c.FormaPagamento,
            c.Fornecedor?.NomeFantasia ?? c.Fornecedor?.RazaoSocial,
            c.Cliente?.Nome, c.Observacoes, c.CriadoEm);
    }
}
