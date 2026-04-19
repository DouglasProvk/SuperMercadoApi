using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Produto
    // ──────────────────────────────────────────────
    public record ProdutoDto(
        int Id, string Nome, string? CodigoBarras, string? CodigoInterno,
        string? Descricao, string? Imagem, string Unidade,
        decimal PrecoCusto, decimal PrecoVenda, decimal? PrecoPromocao,
        bool EmPromocao, DateTime? InicioPromocao, DateTime? FimPromocao,
        decimal PrecoEfetivo,
        decimal QuantidadeEstoque, decimal EstoqueMinimo, decimal? EstoqueMaximo,
        bool EstoqueBaixo,
        DateOnly? DataValidade, int DiasAvisoValidade,
        bool VencimentoProximo, bool Vencido, int? DiasParaVencer,
        string? Localizacao, bool Ativo,
        int? CategoriaId, string? Categoria,
        int? FornecedorId, string? Fornecedor);

    public record CriarProdutoRequest(
        int SupermercadoId,
        string Nome, string? CodigoBarras, string? CodigoInterno,
        string? Descricao, string? Imagem,
        string Unidade,
        decimal PrecoCusto, decimal PrecoVenda,
        decimal QuantidadeEstoque, decimal EstoqueMinimo, decimal? EstoqueMaximo,
        DateOnly? DataValidade, int DiasAvisoValidade,
        string? Localizacao,
        int? CategoriaId, int? FornecedorId,
        string? NCM, string? CEST, decimal? AliquotaICMS);

    public record AtualizarProdutoRequest(
        string? Nome, string? CodigoBarras, string? Descricao, string? Imagem,
        decimal? PrecoCusto, decimal? PrecoVenda,
        decimal? EstoqueMinimo, decimal? EstoqueMaximo,
        DateOnly? DataValidade, int? DiasAvisoValidade,
        string? Localizacao, bool? Ativo,
        int? CategoriaId, int? FornecedorId);

    public record PromocaoRequest(
        bool EmPromocao,
        decimal? PrecoPromocao,
        DateTime? InicioPromocao,
        DateTime? FimPromocao);
}
