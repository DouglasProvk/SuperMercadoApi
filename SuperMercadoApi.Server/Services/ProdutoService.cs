using CommonTemp.DTOs.Input;
using CommonTemp.Models.Sistema;
using Microsoft.EntityFrameworkCore;
using SuperMercadoApi.Server.Context;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Services
{
    public class ProdutoService(AppDbContext db) : IProdutoService
    {
        public async Task<PagedResult<ProdutoDto>> ListarAsync(
            int supermercadoId, int pagina, int tamanho,
            string? busca, int? categoriaId, bool? emPromocao, bool? estoqueBaixo, bool? vencendo)
        {
            var q = db.Produtos
                .Include(p => p.Categoria)
                .Include(p => p.Fornecedor)
                .Where(p => p.SupermercadoId == supermercadoId && p.Ativo)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(busca))
                q = q.Where(p => p.Nome.Contains(busca) ||
                                  (p.CodigoBarras != null && p.CodigoBarras.Contains(busca)) ||
                                  (p.CodigoInterno != null && p.CodigoInterno.Contains(busca)));

            if (categoriaId.HasValue)
                q = q.Where(p => p.CategoriaId == categoriaId);

            if (emPromocao.HasValue)
                q = q.Where(p => p.EmPromocao == emPromocao.Value);

            if (estoqueBaixo == true)
                q = q.Where(p => p.QuantidadeEstoque <= p.EstoqueMinimo);

            if (vencendo == true)
                q = q.Where(p => p.DataValidade != null &&
                                  p.DataValidade >= DateOnly.FromDateTime(DateTime.Today) &&
                                  EF.Functions.DateDiffDay(DateTime.Today, p.DataValidade!.Value.ToDateTime(TimeOnly.MinValue)) <= p.DiasAvisoValidade);

            var total = await q.CountAsync();
            var dados = await q
                .OrderBy(p => p.Nome)
                .Skip((pagina - 1) * tamanho)
                .Take(tamanho)
                .Select(p => MapToDto(p))
                .ToListAsync();

            return new PagedResult<ProdutoDto>(dados, total, pagina, tamanho);
        }

        public async Task<ProdutoDto?> ObterPorIdAsync(int id)
        {
            var p = await db.Produtos
                .Include(p => p.Categoria)
                .Include(p => p.Fornecedor)
                .FirstOrDefaultAsync(p => p.Id == id);
            return p is null ? null : MapToDto(p);
        }

        public async Task<ProdutoDto?> ObterPorCodigoBarrasAsync(string codigo, int supermercadoId)
        {
            var p = await db.Produtos
                .Include(p => p.Categoria)
                .Include(p => p.Fornecedor)
                .FirstOrDefaultAsync(p => p.CodigoBarras == codigo &&
                                          p.SupermercadoId == supermercadoId && p.Ativo);
            return p is null ? null : MapToDto(p);
        }

        public async Task<ProdutoDto> CriarAsync(CriarProdutoRequest req, int usuarioId)
        {
            var produto = new Produto
            {
                SupermercadoId = req.SupermercadoId,
                Nome = req.Nome,
                CodigoBarras = req.CodigoBarras,
                CodigoInterno = req.CodigoInterno,
                Descricao = req.Descricao,
                Imagem = req.Imagem,
                Unidade = req.Unidade,
                PrecoCusto = req.PrecoCusto,
                PrecoVenda = req.PrecoVenda,
                QuantidadeEstoque = req.QuantidadeEstoque,
                EstoqueMinimo = req.EstoqueMinimo,
                EstoqueMaximo = req.EstoqueMaximo,
                DataValidade = req.DataValidade,
                DiasAvisoValidade = req.DiasAvisoValidade,
                Localizacao = req.Localizacao,
                CategoriaId = req.CategoriaId,
                FornecedorId = req.FornecedorId,
                NCM = req.NCM,
                CEST = req.CEST,
                AliquotaICMS = req.AliquotaICMS
            };

            db.Produtos.Add(produto);

            // Movimentação de entrada inicial
            if (req.QuantidadeEstoque > 0)
            {
                db.MovimentacoesEstoque.Add(new MovimentacaoEstoque
                {
                    ProdutoId = produto.Id,
                    UsuarioId = usuarioId,
                    Tipo = "Entrada",
                    Quantidade = req.QuantidadeEstoque,
                    QuantidadeAntes = 0,
                    QuantidadeDepois = req.QuantidadeEstoque,
                    Motivo = "Estoque inicial"
                });
            }

            await db.SaveChangesAsync();
            return (await ObterPorIdAsync(produto.Id))!;
        }

        public async Task<ProdutoDto> AtualizarAsync(int id, AtualizarProdutoRequest req)
        {
            var produto = await db.Produtos.FindAsync(id)
                ?? throw new KeyNotFoundException("Produto não encontrado.");

            if (req.Nome is not null) produto.Nome = req.Nome;
            if (req.CodigoBarras is not null) produto.CodigoBarras = req.CodigoBarras;
            if (req.Descricao is not null) produto.Descricao = req.Descricao;
            if (req.Imagem is not null) produto.Imagem = req.Imagem;
            if (req.PrecoCusto.HasValue) produto.PrecoCusto = req.PrecoCusto.Value;
            if (req.PrecoVenda.HasValue) produto.PrecoVenda = req.PrecoVenda.Value;
            if (req.EstoqueMinimo.HasValue) produto.EstoqueMinimo = req.EstoqueMinimo.Value;
            if (req.EstoqueMaximo.HasValue) produto.EstoqueMaximo = req.EstoqueMaximo;
            if (req.DataValidade.HasValue) produto.DataValidade = req.DataValidade;
            if (req.DiasAvisoValidade.HasValue) produto.DiasAvisoValidade = req.DiasAvisoValidade.Value;
            if (req.Localizacao is not null) produto.Localizacao = req.Localizacao;
            if (req.Ativo.HasValue) produto.Ativo = req.Ativo.Value;
            if (req.CategoriaId.HasValue) produto.CategoriaId = req.CategoriaId;
            if (req.FornecedorId.HasValue) produto.FornecedorId = req.FornecedorId;
            produto.AtualizadoEm = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return (await ObterPorIdAsync(id))!;
        }

        public async Task AtualizarPromocaoAsync(int id, PromocaoRequest req)
        {
            var produto = await db.Produtos.FindAsync(id)
                ?? throw new KeyNotFoundException("Produto não encontrado.");

            produto.EmPromocao = req.EmPromocao;
            produto.PrecoPromocao = req.PrecoPromocao;
            produto.InicioPromocao = req.InicioPromocao;
            produto.FimPromocao = req.FimPromocao;
            produto.AtualizadoEm = DateTime.UtcNow;

            await db.SaveChangesAsync();
        }

        public async Task DeletarAsync(int id)
        {
            var produto = await db.Produtos.FindAsync(id)
                ?? throw new KeyNotFoundException("Produto não encontrado.");
            produto.Ativo = false;
            produto.AtualizadoEm = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        public async Task<List<ProdutoDto>> ObterAlertasAsync(int supermercadoId)
        {
            var hoje = DateOnly.FromDateTime(DateTime.Today);
            var produtos = await db.Produtos
                .Include(p => p.Categoria)
                .Include(p => p.Fornecedor)
                .Where(p => p.SupermercadoId == supermercadoId && p.Ativo &&
                            (p.QuantidadeEstoque <= p.EstoqueMinimo ||
                             (p.DataValidade != null && p.DataValidade >= hoje &&
                              EF.Functions.DateDiffDay(DateTime.Today, p.DataValidade!.Value.ToDateTime(TimeOnly.MinValue)) <= p.DiasAvisoValidade) ||
                             (p.DataValidade != null && p.DataValidade < hoje)))
                .ToListAsync();

            return produtos.Select(MapToDto).ToList();
        }

        private static ProdutoDto MapToDto(Produto p)
        {
            int? diasParaVencer = p.DataValidade.HasValue
                ? (int)(p.DataValidade.Value.ToDateTime(TimeOnly.MinValue) - DateTime.Today).TotalDays
                : null;

            return new ProdutoDto(
                p.Id, p.Nome, p.CodigoBarras, p.CodigoInterno,
                p.Descricao, p.Imagem, p.Unidade,
                p.PrecoCusto, p.PrecoVenda, p.PrecoPromocao,
                p.EmPromocao, p.InicioPromocao, p.FimPromocao,
                p.PrecoEfetivo,
                p.QuantidadeEstoque, p.EstoqueMinimo, p.EstoqueMaximo,
                p.EstoqueBaixo,
                p.DataValidade, p.DiasAvisoValidade,
                p.VencimentoProximo, p.Vencido, diasParaVencer,
                p.Localizacao, p.Ativo,
                p.CategoriaId, p.Categoria?.Nome,
                p.FornecedorId, p.Fornecedor?.NomeFantasia ?? p.Fornecedor?.RazaoSocial);
        }
    }
}
