using CommonTemp.DTOs.Input;

namespace SuperMercadoApi.Server.Interfaces
{
    // ──────────────────────────────────────────────
    // Financeiro Service
    // ──────────────────────────────────────────────
    public interface IFinanceiroService
    {
        Task<PagedResult<ContaDto>> ListarAsync(int supermercadoId, int pagina, int tamanho,
            string? tipo, string? status, DateOnly? de, DateOnly? ate);
        Task<ContaDto> CriarAsync(CriarContaRequest req);
        Task<ContaDto> PagarAsync(int id, PagarContaRequest req);
        Task DeletarAsync(int id);
    }
}
