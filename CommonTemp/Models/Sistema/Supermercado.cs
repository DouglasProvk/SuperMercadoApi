using CommonTemp.Models.Perfis;
namespace CommonTemp.Models.Sistema
{
    public class Supermercado
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CNPJ { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Email { get; set; }
        public string? Endereco { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public string? CEP { get; set; }
        public string? Logo { get; set; }
        public bool Ativo { get; set; } = true;
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
        public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

        public ICollection<Usuario> Usuarios { get; set; } = [];
        public ICollection<Produto> Produtos { get; set; } = [];
        public ICollection<Categoria> Categorias { get; set; } = [];
        public ICollection<Fornecedor> Fornecedores { get; set; } = [];
        public ICollection<Cliente> Clientes { get; set; } = [];
        public ICollection<Venda> Vendas { get; set; } = [];
    }
}
