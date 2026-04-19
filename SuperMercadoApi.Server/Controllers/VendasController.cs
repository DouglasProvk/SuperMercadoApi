using CommonTemp.DTOs.Input;
using Microsoft.AspNetCore.Mvc;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Vendas / PDV ───────────────────────────────
    [Route("api/vendas")]
    public class VendasController(IVendaService service) : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> Listar(
            [FromQuery] int pagina = 1, [FromQuery] int tamanho = 20,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? de = null, [FromQuery] DateTime? ate = null,
            [FromQuery] int? clienteId = null) =>
            Ok(await service.ListarAsync(SupermercadoId, pagina, tamanho, status, de, ate, clienteId));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var v = await service.ObterPorIdAsync(id);
            return v is null ? NotFound() : Ok(v);
        }

        [HttpPost]
        public async Task<IActionResult> Abrir([FromBody] AbrirVendaRequest req)
        {
            if (!TemPermissao("vendas.criar")) return Proibido();
            var v = await service.AbrirVendaAsync(req, UsuarioId);
            return CreatedAtAction(nameof(ObterPorId), new { id = v.Id }, v);
        }

        [HttpPost("{id:int}/itens")]
        public async Task<IActionResult> AdicionarItem(int id, [FromBody] AdicionarItemRequest req)
        {
            if (!TemPermissao("vendas.criar")) return Proibido();
            return Ok(await service.AdicionarItemAsync(id, req));
        }

        [HttpDelete("{id:int}/itens/{itemId:int}")]
        public async Task<IActionResult> RemoverItem(int id, int itemId)
        {
            if (!TemPermissao("vendas.criar")) return Proibido();
            return Ok(await service.RemoverItemAsync(id, itemId));
        }

        [HttpPost("{id:int}/finalizar")]
        public async Task<IActionResult> Finalizar(int id, [FromBody] FinalizarVendaRequest req)
        {
            if (!TemPermissao("vendas.criar")) return Proibido();
            return Ok(await service.FinalizarAsync(id, req, UsuarioId));
        }

        [HttpPost("{id:int}/cancelar")]
        public async Task<IActionResult> Cancelar(int id, [FromBody] CancelarVendaRequest req)
        {
            if (!TemPermissao("vendas.cancelar")) return Proibido();
            return Ok(await service.CancelarAsync(id, req, UsuarioId));
        }
    }
}
