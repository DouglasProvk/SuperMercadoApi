using CommonTemp.DTOs.Input;

namespace SuperMercadoApi.Server.Interfaces
{
    // ──────────────────────────────────────────────
    // Fornecedor Service
    // ──────────────────────────────────────────────
    public interface IFornecedorService
    {
        Task<List<FornecedorDto>> ListarAsync(int supermercadoId, string? busca);
        Task<FornecedorDto?> ObterPorIdAsync(int id);
        Task<FornecedorDto> CriarAsync(CriarFornecedorRequest req);
        Task<FornecedorDto> AtualizarAsync(int id, CriarFornecedorRequest req);
        Task DeletarAsync(int id);
    }
}
