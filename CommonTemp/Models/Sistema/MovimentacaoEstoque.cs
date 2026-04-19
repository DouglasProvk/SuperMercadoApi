
using CommonTemp.Models.Perfis;

namespace CommonTemp.Models.Sistema
{
    // ──────────────────────────────────────────────
    // MovimentacaoEstoque
    // ──────────────────────────────────────────────
    public class MovimentacaoEstoque
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public int UsuarioId { get; set; }
        public string Tipo { get; set; } = string.Empty; // Entrada, Saida, Ajuste, Venda, Devolucao
        public decimal Quantidade { get; set; }
        public decimal QuantidadeAntes { get; set; }
        public decimal QuantidadeDepois { get; set; }
        public string? Motivo { get; set; }
        public int? ReferenciaId { get; set; }
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

        public Produto Produto { get; set; } = null!;
        public Usuario Usuario { get; set; } = null!;
    }
}
