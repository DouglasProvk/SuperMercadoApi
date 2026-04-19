using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using CommonTemp.Models.Perfis;
using CommonTemp.Models.Sistema;
using Microsoft.IdentityModel.Tokens;
using SuperMercadoApi.Server.Interfaces;
using CommonTemp.DTOs.Input;
using SuperMercadoApi.Server.Context;
using Microsoft.EntityFrameworkCore;

namespace SuperMercadoApi.Server.Services
{
    public class AuthService(AppDbContext db, IConfiguration config) : IAuthService
    {
        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var usuario = await db.Usuarios
                .Include(u => u.Perfil)
                .Include(u => u.Supermercado)
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Ativo);

            if (usuario is null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.SenhaHash))
                throw new UnauthorizedAccessException("Email ou senha inválidos.");

            usuario.UltimoLogin = DateTime.UtcNow;
            await db.SaveChangesAsync();

            return await GerarTokensAsync(usuario);
        }

        public async Task<LoginResponse> RefreshTokenAsync(string token)
        {
            var rt = await db.RefreshTokens
                .Include(r => r.Usuario).ThenInclude(u => u.Perfil)
                .Include(r => r.Usuario).ThenInclude(u => u.Supermercado)
                .FirstOrDefaultAsync(r => r.Token == token && !r.Revogado);

            if (rt is null || rt.Expiracao < DateTime.UtcNow)
                throw new UnauthorizedAccessException("Refresh token inválido ou expirado.");

            rt.Revogado = true;
            await db.SaveChangesAsync();

            return await GerarTokensAsync(rt.Usuario);
        }

        public async Task RevogarTokenAsync(string token)
        {
            var rt = await db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == token);
            if (rt is not null)
            {
                rt.Revogado = true;
                await db.SaveChangesAsync();
            }
        }

        // ── Helpers ──────────────────────────────
        private async Task<LoginResponse> GerarTokensAsync(Usuario usuario)
        {
            var permissoes = JsonSerializer.Deserialize<List<string>>(
                usuario.Perfil.Permissoes ?? "[]") ?? [];

            var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new(ClaimTypes.Name,           usuario.Nome),
            new(ClaimTypes.Email,          usuario.Email),
            new("supermercadoId",          usuario.SupermercadoId.ToString()),
            new("perfilId",                usuario.PerfilId.ToString()),
            new("perfil",                  usuario.Perfil.Nome),
        };
            claims.AddRange(permissoes.Select(p => new Claim("permissao", p)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expira = DateTime.UtcNow.AddMinutes(
                               int.Parse(config["Jwt:ExpiresInMinutes"] ?? "60"));

            var jwt = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expira,
                signingCredentials: creds);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            db.RefreshTokens.Add(new RefreshToken
            {
                UsuarioId = usuario.Id,
                Token = refreshToken,
                Expiracao = DateTime.UtcNow.AddDays(
                                int.Parse(config["Jwt:RefreshExpiresInDays"] ?? "7"))
            });
            await db.SaveChangesAsync();

            var usuarioDto = new UsuarioDto(
                usuario.Id, usuario.Nome, usuario.Email,
                usuario.Telefone, usuario.Foto,
                usuario.Perfil.Nome, permissoes,
                usuario.SupermercadoId, usuario.Supermercado.Nome);

            return new LoginResponse(accessToken, refreshToken, expira, usuarioDto);
        }
    }
}
