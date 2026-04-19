using CommonTemp.DTOs.Input;

namespace SuperMercadoApi.Server.Interfaces
{
    // ──────────────────────────────────────────────
    // Venda Service
    // ──────────────────────────────────────────────
    public interface IVendaService
    {
        Task<VendaDto> AbrirVendaAsync(AbrirVendaRequest req, int usuarioId);
        Task<VendaDto> AdicionarItemAsync(int vendaId, AdicionarItemRequest req);
        Task<VendaDto> RemoverItemAsync(int vendaId, int itemId);
        Task<VendaDto> FinalizarAsync(int vendaId, FinalizarVendaRequest req, int usuarioId);
        Task<VendaDto> CancelarAsync(int vendaId, CancelarVendaRequest req, int usuarioId);
        Task<VendaDto?> ObterPorIdAsync(int id);
        Task<PagedResult<VendaDto>> ListarAsync(int supermercadoId, int pagina, int tamanho,
            string? status, DateTime? de, DateTime? ate, int? clienteId);
    }
}
