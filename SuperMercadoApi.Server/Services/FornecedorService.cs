using CommonTemp.DTOs.Input;
using CommonTemp.Models.Sistema;
using SuperMercadoApi.Server.Context;
using SuperMercadoApi.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SuperMercadoApi.Server.Services
{
    public class FornecedorService(AppDbContext db) : IFornecedorService
    {
        public async Task<List<FornecedorDto>> ListarAsync(int supermercadoId, string? busca)
        {
            var q = db.Fornecedores.Where(f => f.SupermercadoId == supermercadoId && f.Ativo).AsQueryable();
            if (!string.IsNullOrWhiteSpace(busca))
                q = q.Where(f => f.RazaoSocial.Contains(busca) ||
                                  (f.NomeFantasia != null && f.NomeFantasia.Contains(busca)) ||
                                  (f.CNPJ != null && f.CNPJ.Contains(busca)));
            return await q.OrderBy(f => f.RazaoSocial).Select(f => MapToDto(f)).ToListAsync();
        }

        public async Task<FornecedorDto?> ObterPorIdAsync(int id)
        {
            var f = await db.Fornecedores.FindAsync(id);
            return f is null ? null : MapToDto(f);
        }

        public async Task<FornecedorDto> CriarAsync(CriarFornecedorRequest req)
        {
            var f = new Fornecedor
            {
                SupermercadoId = req.SupermercadoId,
                RazaoSocial = req.RazaoSocial,
                NomeFantasia = req.NomeFantasia,
                CNPJ = req.CNPJ,
                Telefone = req.Telefone,
                Email = req.Email,
                Contato = req.Contato,
                Endereco = req.Endereco,
                Cidade = req.Cidade,
                Estado = req.Estado
            };
            db.Fornecedores.Add(f);
            await db.SaveChangesAsync();
            return MapToDto(f);
        }

        public async Task<FornecedorDto> AtualizarAsync(int id, CriarFornecedorRequest req)
        {
            var f = await db.Fornecedores.FindAsync(id) ?? throw new KeyNotFoundException();
            f.RazaoSocial = req.RazaoSocial; f.NomeFantasia = req.NomeFantasia;
            f.CNPJ = req.CNPJ; f.Telefone = req.Telefone; f.Email = req.Email;
            f.Contato = req.Contato; f.Cidade = req.Cidade; f.Estado = req.Estado;
            f.AtualizadoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return MapToDto(f);
        }

        public async Task DeletarAsync(int id)
        {
            var f = await db.Fornecedores.FindAsync(id) ?? throw new KeyNotFoundException();
            f.Ativo = false; f.AtualizadoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        private static FornecedorDto MapToDto(Fornecedor f) => new(
            f.Id, f.RazaoSocial, f.NomeFantasia, f.CNPJ,
            f.Telefone, f.Email, f.Contato, f.Cidade, f.Estado, f.Ativo);
    }
}
