using Microsoft.AspNetCore.Mvc;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Dashboard ──────────────────────────────────
    [Route("api/dashboard")]
    public class DashboardController(IRelatorioService relatorioService) : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> Get() =>
            Ok(await relatorioService.ObterDashboardAsync(SupermercadoId));
    }
}
