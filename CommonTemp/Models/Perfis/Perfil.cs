
namespace CommonTemp.Models.Perfis
{
    // ──────────────────────────────────────────────
    // Perfil
    // ──────────────────────────────────────────────
    public class Perfil
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? Permissoes { get; set; } // JSON array
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

        public ICollection<Usuario> Usuarios { get; set; } = [];
    }
}
