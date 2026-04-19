

namespace CommonTemp.Models.Sistema
{
    // ──────────────────────────────────────────────
    // ItemVenda
    // ──────────────────────────────────────────────
    public class ItemVenda
    {
        public int Id { get; set; }
        public int VendaId { get; set; }
        public int ProdutoId { get; set; }
        public decimal Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }
        public decimal Desconto { get; set; }
        public decimal Subtotal { get; set; }
        public bool EmPromocao { get; set; }

        public Venda Venda { get; set; } = null!;
        public Produto Produto { get; set; } = null!;
    }
}
