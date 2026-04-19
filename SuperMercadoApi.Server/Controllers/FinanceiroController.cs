using CommonTemp.DTOs.Input;
using Microsoft.AspNetCore.Mvc;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Financeiro ─────────────────────────────────
    [Route("api/financeiro")]
    public class FinanceiroController(IFinanceiroService service) : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> Listar(
            [FromQuery] int pagina = 1, [FromQuery] int tamanho = 20,
            [FromQuery] string? tipo = null, [FromQuery] string? status = null,
            [FromQuery] DateOnly? de = null, [FromQuery] DateOnly? ate = null) =>
            Ok(await service.ListarAsync(SupermercadoId, pagina, tamanho, tipo, status, de, ate));

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarContaRequest req)
        {
            if (!TemPermissao("financeiro.criar")) return Proibido();
            return Ok(await service.CriarAsync(req));
        }

        [HttpPost("{id:int}/pagar")]
        public async Task<IActionResult> Pagar(int id, [FromBody] PagarContaRequest req)
        {
            if (!TemPermissao("financeiro.criar")) return Proibido();
            return Ok(await service.PagarAsync(id, req));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Deletar(int id)
        {
            if (!TemPermissao("financeiro.criar")) return Proibido();
            await service.DeletarAsync(id);
            return NoContent();
        }
    }
}
