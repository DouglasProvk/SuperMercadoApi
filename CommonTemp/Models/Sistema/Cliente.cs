

namespace CommonTemp.Models.Sistema
{
    // ──────────────────────────────────────────────
    // Cliente
    // ──────────────────────────────────────────────
    public class Cliente
    {
        public int Id { get; set; }
        public int SupermercadoId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? CPF { get; set; }
        public string? Email { get; set; }
        public string? Telefone { get; set; }
        public DateOnly? DataNascimento { get; set; }
        public string? Endereco { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public int PontosAcumulados { get; set; }
        public bool Ativo { get; set; } = true;
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
        public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

        public Supermercado Supermercado { get; set; } = null!;
        public ICollection<Venda> Vendas { get; set; } = [];
    }
}
