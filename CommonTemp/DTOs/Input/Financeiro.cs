using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Financeiro
    // ──────────────────────────────────────────────
    public record ContaDto(
        int Id, string Tipo, string Descricao, decimal Valor,
        DateOnly DataVencimento, DateOnly? DataPagamento,
        string Status, string? FormaPagamento,
        string? Fornecedor, string? Cliente,
        string? Observacoes, DateTime CriadoEm);

    public record CriarContaRequest(
        int SupermercadoId, string Tipo, string Descricao,
        decimal Valor, DateOnly DataVencimento,
        int? FornecedorId, int? ClienteId,
        string? FormaPagamento, string? Observacoes);

    public record PagarContaRequest(DateOnly DataPagamento, string? FormaPagamento);
}
