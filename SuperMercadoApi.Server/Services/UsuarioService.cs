using CommonTemp.DTOs.Input;
using CommonTemp.Models.Perfis;
using SuperMercadoApi.Server.Context;
using SuperMercadoApi.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SuperMercadoApi.Server.Services
{
    public class UsuarioService(AppDbContext db) : IUsuarioService
    {
        public async Task<List<UsuarioDto>> ListarAsync(int supermercadoId)
        {
            return await db.Usuarios
                .Include(u => u.Perfil)
                .Include(u => u.Supermercado)
                .Where(u => u.SupermercadoId == supermercadoId)
                .Select(u => MapToDto(u))
                .ToListAsync();
        }

        public async Task<UsuarioDto> CriarAsync(CriarUsuarioRequest req)
        {
            if (await db.Usuarios.AnyAsync(u => u.Email == req.Email))
                throw new InvalidOperationException("Email já cadastrado.");

            var u = new Usuario
            {
                SupermercadoId = req.SupermercadoId,
                PerfilId = req.PerfilId,
                Nome = req.Nome,
                Email = req.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(req.Senha),
                Telefone = req.Telefone
            };
            db.Usuarios.Add(u);
            await db.SaveChangesAsync();

            await db.Entry(u).Reference(x => x.Perfil).LoadAsync();
            await db.Entry(u).Reference(x => x.Supermercado).LoadAsync();
            return MapToDto(u);
        }

        public async Task<UsuarioDto> AtualizarAsync(int id, AtualizarUsuarioRequest req)
        {
            var u = await db.Usuarios.Include(u => u.Perfil).Include(u => u.Supermercado)
                .FirstOrDefaultAsync(u => u.Id == id) ?? throw new KeyNotFoundException();

            if (req.PerfilId.HasValue) u.PerfilId = req.PerfilId.Value;
            if (req.Nome is not null) u.Nome = req.Nome;
            if (req.Telefone is not null) u.Telefone = req.Telefone;
            if (req.Foto is not null) u.Foto = req.Foto;
            if (req.Ativo.HasValue) u.Ativo = req.Ativo.Value;
            u.AtualizadoEm = DateTime.UtcNow;

            await db.SaveChangesAsync();
            await db.Entry(u).Reference(x => x.Perfil).LoadAsync();
            return MapToDto(u);
        }

        public async Task DeletarAsync(int id)
        {
            var u = await db.Usuarios.FindAsync(id) ?? throw new KeyNotFoundException();
            u.Ativo = false; u.AtualizadoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        public async Task AlterarSenhaAsync(int id, string novaSenha)
        {
            var u = await db.Usuarios.FindAsync(id) ?? throw new KeyNotFoundException();
            u.SenhaHash = BCrypt.Net.BCrypt.HashPassword(novaSenha);
            u.AtualizadoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        private static UsuarioDto MapToDto(Usuario u)
        {
            var permissoes = System.Text.Json.JsonSerializer.Deserialize<List<string>>(
                u.Perfil?.Permissoes ?? "[]") ?? [];
            return new UsuarioDto(u.Id, u.Nome, u.Email, u.Telefone, u.Foto,
                u.Perfil?.Nome ?? "", permissoes,
                u.SupermercadoId, u.Supermercado?.Nome ?? "");
        }
    }
}
