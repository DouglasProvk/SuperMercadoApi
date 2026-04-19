
namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Auth
    // ──────────────────────────────────────────────
    public record LoginRequest(string Email, string Senha);

    public record LoginResponse(
        string AccessToken,
        string RefreshToken,
        DateTime Expiracao,
        UsuarioDto Usuario);

    public record RefreshTokenRequest(string Token);
}
