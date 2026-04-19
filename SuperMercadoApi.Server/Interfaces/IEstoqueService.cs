using CommonTemp.DTOs.Input;

namespace SuperMercadoApi.Server.Interfaces
{
    // ──────────────────────────────────────────────
    // Estoque Service
    // ──────────────────────────────────────────────
    public interface IEstoqueService
    {
        Task<MovimentacaoDto> MovimentarAsync(MovimentacaoRequest req, int usuarioId);
        Task<PagedResult<MovimentacaoDto>> HistoricoAsync(int produtoId, int pagina, int tamanho);
        Task<List<MovimentacaoDto>> HistoricoSupermercadoAsync(int supermercadoId, DateTime? de, DateTime? ate);
    }
}
