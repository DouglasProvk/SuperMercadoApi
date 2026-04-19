using CommonTemp.Models.Sistema;
namespace CommonTemp.Models.Perfis
{
    // ──────────────────────────────────────────────
    // Usuario
    // ──────────────────────────────────────────────
    public class Usuario
    {
        public int Id { get; set; }
        public int SupermercadoId { get; set; }
        public int PerfilId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SenhaHash { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Foto { get; set; }
        public bool Ativo { get; set; } = true;
        public DateTime? UltimoLogin { get; set; }
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
        public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

        public Supermercado Supermercado { get; set; } = null!;
        public Perfil Perfil { get; set; } = null!;
        public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    }
}
