using CommonTemp.DTOs.Input;
using CommonTemp.Models.Sistema;
using SuperMercadoApi.Server.Context;
using SuperMercadoApi.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SuperMercadoApi.Server.Services
{
    public class ClienteService(AppDbContext db) : IClienteService
    {
        public async Task<PagedResult<ClienteDto>> ListarAsync(int supermercadoId, int pagina, int tamanho, string? busca)
        {
            var q = db.Clientes.Where(c => c.SupermercadoId == supermercadoId && c.Ativo).AsQueryable();
            if (!string.IsNullOrWhiteSpace(busca))
                q = q.Where(c => c.Nome.Contains(busca) ||
                                  (c.CPF != null && c.CPF.Contains(busca)) ||
                                  (c.Telefone != null && c.Telefone.Contains(busca)));
            var total = await q.CountAsync();
            var dados = await q.OrderBy(c => c.Nome).Skip((pagina - 1) * tamanho).Take(tamanho)
                .Select(c => MapToDto(c)).ToListAsync();
            return new PagedResult<ClienteDto>(dados, total, pagina, tamanho);
        }

        public async Task<ClienteDto?> ObterPorIdAsync(int id)
        {
            var c = await db.Clientes.FindAsync(id);
            return c is null ? null : MapToDto(c);
        }

        public async Task<ClienteDto> CriarAsync(CriarClienteRequest req)
        {
            var c = new Cliente
            {
                SupermercadoId = req.SupermercadoId,
                Nome = req.Nome,
                CPF = req.CPF,
                Email = req.Email,
                Telefone = req.Telefone,
                DataNascimento = req.DataNascimento,
                Endereco = req.Endereco,
                Cidade = req.Cidade,
                Estado = req.Estado
            };
            db.Clientes.Add(c);
            await db.SaveChangesAsync();
            return MapToDto(c);
        }

        public async Task<ClienteDto> AtualizarAsync(int id, CriarClienteRequest req)
        {
            var c = await db.Clientes.FindAsync(id) ?? throw new KeyNotFoundException();
            c.Nome = req.Nome; c.CPF = req.CPF; c.Email = req.Email;
            c.Telefone = req.Telefone; c.DataNascimento = req.DataNascimento;
            c.Endereco = req.Endereco; c.Cidade = req.Cidade; c.Estado = req.Estado;
            c.AtualizadoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return MapToDto(c);
        }

        public async Task DeletarAsync(int id)
        {
            var c = await db.Clientes.FindAsync(id) ?? throw new KeyNotFoundException();
            c.Ativo = false; c.AtualizadoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        private static ClienteDto MapToDto(Cliente c) => new(
            c.Id, c.Nome, c.CPF, c.Email, c.Telefone, c.DataNascimento,
            c.Cidade, c.Estado, c.PontosAcumulados, c.Ativo, c.CriadoEm);
    }
}
