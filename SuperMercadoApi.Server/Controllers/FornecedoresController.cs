using CommonTemp.DTOs.Input;
using Microsoft.AspNetCore.Mvc;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Fornecedores ───────────────────────────────
    [Route("api/fornecedores")]
    public class FornecedoresController(IFornecedorService service) : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> Listar([FromQuery] string? busca = null) =>
            Ok(await service.ListarAsync(SupermercadoId, busca));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var f = await service.ObterPorIdAsync(id);
            return f is null ? NotFound() : Ok(f);
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarFornecedorRequest req)
        {
            if (!TemPermissao("fornecedores.criar")) return Proibido();
            var f = await service.CriarAsync(req);
            return CreatedAtAction(nameof(ObterPorId), new { id = f.Id }, f);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] CriarFornecedorRequest req)
        {
            if (!TemPermissao("fornecedores.criar")) return Proibido();
            return Ok(await service.AtualizarAsync(id, req));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Deletar(int id)
        {
            if (!TemPermissao("fornecedores.criar")) return Proibido();
            await service.DeletarAsync(id);
            return NoContent();
        }
    }
}
