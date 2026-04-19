using CommonTemp.DTOs.Input;

namespace SuperMercadoApi.Server.Interfaces
{
    // ──────────────────────────────────────────────
    // Relatório Service
    // ──────────────────────────────────────────────
    public interface IRelatorioService
    {
        Task<DashboardDto> ObterDashboardAsync(int supermercadoId);
    }
}
