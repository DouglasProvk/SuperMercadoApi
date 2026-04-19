using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Estoque
    // ──────────────────────────────────────────────
    public record MovimentacaoRequest(
        int ProdutoId,
        string Tipo,       // Entrada, Saida, Ajuste, Devolucao
        decimal Quantidade,
        string? Motivo);

    public record MovimentacaoDto(
        int Id, int ProdutoId, string Produto,
        string Tipo, decimal Quantidade,
        decimal QuantidadeAntes, decimal QuantidadeDepois,
        string? Motivo, string Usuario, DateTime CriadoEm);
}
