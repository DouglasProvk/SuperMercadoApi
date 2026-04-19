using CommonTemp.DTOs.Input;

namespace SuperMercadoApi.Server.Interfaces
{
    // ──────────────────────────────────────────────
    // Cliente Service
    // ──────────────────────────────────────────────
    public interface IClienteService
    {
        Task<PagedResult<ClienteDto>> ListarAsync(int supermercadoId, int pagina, int tamanho, string? busca);
        Task<ClienteDto?> ObterPorIdAsync(int id);
        Task<ClienteDto> CriarAsync(CriarClienteRequest req);
        Task<ClienteDto> AtualizarAsync(int id, CriarClienteRequest req);
        Task DeletarAsync(int id);
    }
}
