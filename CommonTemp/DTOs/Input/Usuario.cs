using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Usuario
    // ──────────────────────────────────────────────
    public record UsuarioDto(
        int Id, string Nome, string Email,
        string? Telefone, string? Foto,
        string Perfil, List<string> Permissoes,
        int SupermercadoId, string Supermercado);

    public record CriarUsuarioRequest(
        int SupermercadoId, int PerfilId,
        string Nome, string Email, string Senha,
        string? Telefone);

    public record AtualizarUsuarioRequest(
        int? PerfilId, string? Nome,
        string? Telefone, string? Foto, bool? Ativo);
}
