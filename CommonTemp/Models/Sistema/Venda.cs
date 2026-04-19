
using CommonTemp.Models.Perfis;

namespace CommonTemp.Models.Sistema
{
    // ──────────────────────────────────────────────
    // Venda
    // ──────────────────────────────────────────────
    public class Venda
    {
        public int Id { get; set; }
        public int SupermercadoId { get; set; }
        public int? ClienteId { get; set; }
        public int UsuarioId { get; set; }
        public string NumeroVenda { get; set; } = string.Empty;
        public string Status { get; set; } = "Aberta";
        public decimal Subtotal { get; set; }
        public decimal Desconto { get; set; }
        public decimal Acrescimo { get; set; }
        public decimal Total { get; set; }
        public string? FormaPagamento { get; set; }
        public decimal? ValorPago { get; set; }
        public decimal? Troco { get; set; }
        public string? Observacoes { get; set; }
        public DateTime? CanceladoEm { get; set; }
        public int? CanceladoPor { get; set; }
        public string? MotivoCancelamento { get; set; }
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
        public DateTime? FinalizadoEm { get; set; }

        public Supermercado Supermercado { get; set; } = null!;
        public Cliente? Cliente { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public ICollection<ItemVenda> Itens { get; set; } = [];
    }
}
