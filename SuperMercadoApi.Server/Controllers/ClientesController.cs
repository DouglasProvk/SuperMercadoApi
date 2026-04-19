using CommonTemp.DTOs.Input;
using Microsoft.AspNetCore.Mvc;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Clientes ───────────────────────────────────
    [Route("api/clientes")]
    public class ClientesController(IClienteService service) : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> Listar(
            [FromQuery] int pagina = 1, [FromQuery] int tamanho = 20,
            [FromQuery] string? busca = null) =>
            Ok(await service.ListarAsync(SupermercadoId, pagina, tamanho, busca));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var c = await service.ObterPorIdAsync(id);
            return c is null ? NotFound() : Ok(c);
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarClienteRequest req)
        {
            if (!TemPermissao("clientes.criar")) return Proibido();
            var c = await service.CriarAsync(req);
            return CreatedAtAction(nameof(ObterPorId), new { id = c.Id }, c);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] CriarClienteRequest req)
        {
            if (!TemPermissao("clientes.editar")) return Proibido();
            return Ok(await service.AtualizarAsync(id, req));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Deletar(int id)
        {
            if (!TemPermissao("clientes.editar")) return Proibido();
            await service.DeletarAsync(id);
            return NoContent();
        }
    }
}
