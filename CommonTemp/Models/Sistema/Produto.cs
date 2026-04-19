

namespace CommonTemp.Models.Sistema
{
    // ──────────────────────────────────────────────
    // Produto
    // ──────────────────────────────────────────────
    public class Produto
    {
        public int Id { get; set; }
        public int SupermercadoId { get; set; }
        public int? CategoriaId { get; set; }
        public int? FornecedorId { get; set; }
        public string? CodigoBarras { get; set; }
        public string? CodigoInterno { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? Imagem { get; set; }
        public string Unidade { get; set; } = "UN";
        public decimal PrecoCusto { get; set; }
        public decimal PrecoVenda { get; set; }
        public decimal? PrecoPromocao { get; set; }
        public bool EmPromocao { get; set; }
        public DateTime? InicioPromocao { get; set; }
        public DateTime? FimPromocao { get; set; }
        public decimal QuantidadeEstoque { get; set; }
        public decimal EstoqueMinimo { get; set; } = 5;
        public decimal? EstoqueMaximo { get; set; }
        public DateOnly? DataValidade { get; set; }
        public int DiasAvisoValidade { get; set; } = 30;
        public string? Localizacao { get; set; }
        public string? NCM { get; set; }
        public string? CEST { get; set; }
        public decimal? AliquotaICMS { get; set; }
        public bool Ativo { get; set; } = true;
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
        public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

        public Supermercado? Supermercado { get; set; }
        public Categoria? Categoria { get; set; }
        public Fornecedor? Fornecedor { get; set; }
        public ICollection<MovimentacaoEstoque> Movimentacoes { get; set; } = [];

        // Computed helpers
        public decimal PrecoEfetivo => EmPromocao && PrecoPromocao.HasValue ? PrecoPromocao.Value : PrecoVenda;
        public bool EstoqueBaixo => QuantidadeEstoque <= EstoqueMinimo;
        public bool VencimentoProximo => DataValidade.HasValue &&
            DataValidade.Value.ToDateTime(TimeOnly.MinValue) >= DateTime.Today &&
            (DataValidade.Value.ToDateTime(TimeOnly.MinValue) - DateTime.Today).TotalDays <= DiasAvisoValidade;
        public bool Vencido => DataValidade.HasValue &&
            DataValidade.Value.ToDateTime(TimeOnly.MinValue) < DateTime.Today;
    }
}
