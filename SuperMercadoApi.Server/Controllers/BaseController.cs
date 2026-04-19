using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Base Controller ────────────────────────────
    [ApiController]
    [Authorize]
    public abstract class BaseController : ControllerBase
    {
        protected int UsuarioId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        protected int SupermercadoId =>
            int.Parse(User.FindFirstValue("supermercadoId")!);

        protected bool TemPermissao(string permissao) =>
            User.HasClaim("permissao", permissao);

        protected IActionResult Proibido() =>
            Forbid();
    }
}
