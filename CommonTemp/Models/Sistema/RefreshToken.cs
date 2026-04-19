using CommonTemp.Models.Perfis;

namespace CommonTemp.Models.Sistema
{
    // ──────────────────────────────────────────────
    // RefreshToken
    // ──────────────────────────────────────────────
    public class RefreshToken
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime Expiracao { get; set; }
        public bool Revogado { get; set; }
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

        public Usuario Usuario { get; set; } = null!;
    }
}
