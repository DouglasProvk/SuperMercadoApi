

namespace CommonTemp.Models.Sistema
{
    // ──────────────────────────────────────────────
    // Fornecedor
    // ──────────────────────────────────────────────
    public class Fornecedor
    {
        public int Id { get; set; }
        public int SupermercadoId { get; set; }
        public string RazaoSocial { get; set; } = string.Empty;
        public string? NomeFantasia { get; set; }
        public string? CNPJ { get; set; }
        public string? Telefone { get; set; }
        public string? Email { get; set; }
        public string? Contato { get; set; }
        public string? Endereco { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public bool Ativo { get; set; } = true;
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
        public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

        public Supermercado Supermercado { get; set; } = null!;
        public ICollection<Produto> Produtos { get; set; } = [];
    }
}
