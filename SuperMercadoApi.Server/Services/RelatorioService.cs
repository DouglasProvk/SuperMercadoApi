using CommonTemp.DTOs.Input;
using SuperMercadoApi.Server.Context;
using SuperMercadoApi.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SuperMercadoApi.Server.Services
{
    public class RelatorioService(AppDbContext db) : IRelatorioService
    {
        public async Task<DashboardDto> ObterDashboardAsync(int supermercadoId)
        {
            var hoje = DateTime.Today;

            var vendasHoje = await db.Vendas
                .Where(v => v.SupermercadoId == supermercadoId && v.Status == "Finalizada"
                         && v.CriadoEm.Date == hoje)
                .GroupBy(v => 1)
                .Select(g => new { Total = g.Sum(v => v.Total), Qtd = g.Count() })
                .FirstOrDefaultAsync();

            var vendasMes = await db.Vendas
                .Where(v => v.SupermercadoId == supermercadoId && v.Status == "Finalizada"
                         && v.CriadoEm.Month == hoje.Month && v.CriadoEm.Year == hoje.Year)
                .SumAsync(v => v.Total);

            var totalProdutos = await db.Produtos
                .CountAsync(p => p.SupermercadoId == supermercadoId && p.Ativo);

            var estoqueBaixo = await db.Produtos
                .CountAsync(p => p.SupermercadoId == supermercadoId && p.Ativo
                              && p.QuantidadeEstoque <= p.EstoqueMinimo);

            var hojeDate = DateOnly.FromDateTime(hoje);
            // EF Core cannot translate DateOnly.ToDateTime inside SQL (used by DateDiffDay).
            // Retrieve candidate products with translatable filters and evaluate the per-row days check in memory.
            var vencendoCandidates = await db.Produtos
                .Where(p => p.SupermercadoId == supermercadoId && p.Ativo
                              && p.DataValidade != null && p.DataValidade >= hojeDate)
                .ToListAsync();

            var vencendo = vencendoCandidates.Count(p =>
                (p.DataValidade!.Value.ToDateTime(TimeOnly.MinValue) - hoje).TotalDays <= p.DiasAvisoValidade);

            var totalClientes = await db.Clientes
                .CountAsync(c => c.SupermercadoId == supermercadoId && c.Ativo);

            var vencer7 = DateOnly.FromDateTime(hoje.AddDays(7));
            var contasVencer = await db.Contas
                .Where(c => c.SupermercadoId == supermercadoId && c.Tipo == "Pagar"
                         && c.Status == "Pendente" && c.DataVencimento >= hojeDate
                         && c.DataVencimento <= vencer7)
                .SumAsync(c => c.Valor);

            // Gráfico últimos 7 dias
            var de7 = hoje.AddDays(-6);
            // EF Core cannot translate some DateTime.Date/ToString/grouping operations to SQL in all providers.
            // Retrieve the recent vendas and perform grouping in memory.
            var vendasRecentes = await db.Vendas
                .Where(v => v.SupermercadoId == supermercadoId && v.Status == "Finalizada"
                         && v.CriadoEm.Date >= de7)
                .ToListAsync();

            var grafico = vendasRecentes
                .GroupBy(v => v.CriadoEm.Date)
                .OrderBy(g => g.Key)
                .Select(g => new VendaDiaDto(
                    g.Key.ToString("dd/MM"), g.Sum(v => v.Total), g.Count()))
                .ToList();

            // Alertas
            var alertas = new List<AlertaDto>();
            if (estoqueBaixo > 0)
                alertas.Add(new AlertaDto("EstoqueBaixo",
                    $"{estoqueBaixo} produto(s) com estoque abaixo do mínimo", "warning", null));
            if (vencendo > 0)
                alertas.Add(new AlertaDto("Vencimento",
                    $"{vencendo} produto(s) próximos do vencimento", "warning", null));
            if (contasVencer > 0)
                alertas.Add(new AlertaDto("ContasVencer",
                    $"R$ {contasVencer:N2} em contas vencendo nos próximos 7 dias", "danger", null));

            return new DashboardDto(
                vendasHoje?.Total ?? 0, vendasHoje?.Qtd ?? 0,
                vendasMes, totalProdutos, estoqueBaixo,
                vencendo, totalClientes, contasVencer,
                grafico, alertas);
        }
    }
}
