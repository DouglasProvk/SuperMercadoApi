using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Fornecedor
    // ──────────────────────────────────────────────
    public record FornecedorDto(
        int Id, string RazaoSocial, string? NomeFantasia,
        string? CNPJ, string? Telefone, string? Email,
        string? Contato, string? Cidade, string? Estado, bool Ativo);

    public record CriarFornecedorRequest(
        int SupermercadoId, string RazaoSocial, string? NomeFantasia,
        string? CNPJ, string? Telefone, string? Email,
        string? Contato, string? Endereco, string? Cidade, string? Estado);
}
