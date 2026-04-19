using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Dashboard / Relatórios
    // ──────────────────────────────────────────────
    public record DashboardDto(
        decimal VendasHoje, int QtdVendasHoje,
        decimal VendasMes,
        int TotalProdutos, int ProdutosEstoqueBaixo,
        int ProdutosVencendo, int TotalClientes,
        decimal ContasVencer7Dias,
        List<VendaDiaDto> GraficoVendas,
        List<AlertaDto> Alertas);

    public record VendaDiaDto(string Data, decimal Total, int Qtd);

    public record AlertaDto(string Tipo, string Mensagem, string Nivel, int? RefId);
}
