using CommonTemp.DTOs.Input;

namespace SuperMercadoApi.Server.Interfaces
{
    // ──────────────────────────────────────────────
    // Usuario Service
    // ──────────────────────────────────────────────
    public interface IUsuarioService
    {
        Task<List<UsuarioDto>> ListarAsync(int supermercadoId);
        Task<UsuarioDto> CriarAsync(CriarUsuarioRequest req);
        Task<UsuarioDto> AtualizarAsync(int id, AtualizarUsuarioRequest req);
        Task DeletarAsync(int id);
        Task AlterarSenhaAsync(int id, string novaSenha);
    }
}
