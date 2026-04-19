

namespace CommonTemp.Models.Sistema
{
    // ──────────────────────────────────────────────
    // Categoria
    // ──────────────────────────────────────────────
    public class Categoria
    {
        public int Id { get; set; }
        public int SupermercadoId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? Cor { get; set; }
        public string? Icone { get; set; }
        public bool Ativo { get; set; } = true;
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

        public Supermercado Supermercado { get; set; } = null!;
        public ICollection<Produto> Produtos { get; set; } = [];
    }
}
