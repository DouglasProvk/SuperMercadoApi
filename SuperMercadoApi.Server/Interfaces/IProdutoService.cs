using CommonTemp.DTOs.Input;

namespace SuperMercadoApi.Server.Interfaces
{
    // ──────────────────────────────────────────────
    // Produto Service
    // ──────────────────────────────────────────────
    public interface IProdutoService
    {
        Task<PagedResult<ProdutoDto>> ListarAsync(int supermercadoId, int pagina, int tamanho,
            string? busca, int? categoriaId, bool? emPromocao, bool? estoqueBaixo, bool? vencendo);
        Task<ProdutoDto?> ObterPorIdAsync(int id);
        Task<ProdutoDto?> ObterPorCodigoBarrasAsync(string codigo, int supermercadoId);
        Task<ProdutoDto> CriarAsync(CriarProdutoRequest req, int usuarioId);
        Task<ProdutoDto> AtualizarAsync(int id, AtualizarProdutoRequest req);
        Task AtualizarPromocaoAsync(int id, PromocaoRequest req);
        Task DeletarAsync(int id);
        Task<List<ProdutoDto>> ObterAlertasAsync(int supermercadoId);
    }
}
