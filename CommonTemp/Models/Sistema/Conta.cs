using CommonTemp.Models.Perfis;
using CommonTemp.Models.Sistema;

namespace CommonTemp.Models.Sistema
{
    // ──────────────────────────────────────────────
    // Conta Financeira
    // ──────────────────────────────────────────────
    public class Conta
    {
        public int Id { get; set; }
        public int SupermercadoId { get; set; }
        public string Tipo { get; set; } = string.Empty; // Pagar, Receber
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public DateOnly DataVencimento { get; set; }
        public DateOnly? DataPagamento { get; set; }
        public string Status { get; set; } = "Pendente";
        public int? FornecedorId { get; set; }
        public int? ClienteId { get; set; }
        public int? VendaId { get; set; }
        public string? FormaPagamento { get; set; }
        public string? Observacoes { get; set; }
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
        public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

        public Supermercado Supermercado { get; set; } = null!;
        public Fornecedor? Fornecedor { get; set; }
        public Cliente? Cliente { get; set; }
    }
}
