using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Cliente
    // ──────────────────────────────────────────────
    public record ClienteDto(
        int Id, string Nome, string? CPF, string? Email,
        string? Telefone, DateOnly? DataNascimento,
        string? Cidade, string? Estado,
        int PontosAcumulados, bool Ativo, DateTime CriadoEm);

    public record CriarClienteRequest(
        int SupermercadoId, string Nome, string? CPF,
        string? Email, string? Telefone,
        DateOnly? DataNascimento, string? Endereco,
        string? Cidade, string? Estado);
}
