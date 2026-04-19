using CommonTemp.DTOs.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Auth ───────────────────────────────────────
    [Route("api/auth")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var result = await authService.LoginAsync(req);
            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest req)
        {
            var result = await authService.RefreshTokenAsync(req.Token);
            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest req)
        {
            await authService.RevogarTokenAsync(req.Token);
            return NoContent();
        }
    }
}
