using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Venda
    // ──────────────────────────────────────────────
    public record AbrirVendaRequest(
        int SupermercadoId,
        int? ClienteId);

    public record AdicionarItemRequest(
        int ProdutoId,
        decimal Quantidade,
        decimal? PrecoUnitario,   // null = usa preço do produto
        decimal Desconto);

    public record FinalizarVendaRequest(
        string FormaPagamento,
        decimal ValorPago,
        decimal Desconto,
        decimal Acrescimo);

    public record CancelarVendaRequest(string Motivo);

    public record VendaDto(
        int Id, string NumeroVenda, string Status,
        int? ClienteId, string? Cliente,
        string Usuario,
        decimal Subtotal, decimal Desconto, decimal Acrescimo, decimal Total,
        string? FormaPagamento, decimal? ValorPago, decimal? Troco,
        List<ItemVendaDto> Itens,
        DateTime CriadoEm, DateTime? FinalizadoEm);

    public record ItemVendaDto(
        int Id, int ProdutoId, string Produto,
        decimal Quantidade, decimal PrecoUnitario,
        decimal Desconto, decimal Subtotal, bool EmPromocao);
}
