using CommonTemp.DTOs.Input;
using Microsoft.AspNetCore.Mvc;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Produtos ───────────────────────────────────
    [Route("api/produtos")]
    public class ProdutosController(IProdutoService service) : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> Listar(
            [FromQuery] int pagina = 1, [FromQuery] int tamanho = 20,
            [FromQuery] string? busca = null, [FromQuery] int? categoriaId = null,
            [FromQuery] bool? emPromocao = null, [FromQuery] bool? estoqueBaixo = null,
            [FromQuery] bool? vencendo = null) =>
            Ok(await service.ListarAsync(SupermercadoId, pagina, tamanho,
                busca, categoriaId, emPromocao, estoqueBaixo, vencendo));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var p = await service.ObterPorIdAsync(id);
            return p is null ? NotFound() : Ok(p);
        }

        [HttpGet("codigo/{codigo}")]
        public async Task<IActionResult> ObterPorCodigo(string codigo)
        {
            var p = await service.ObterPorCodigoBarrasAsync(codigo, SupermercadoId);
            return p is null ? NotFound() : Ok(p);
        }

        [HttpGet("alertas")]
        public async Task<IActionResult> Alertas() =>
            Ok(await service.ObterAlertasAsync(SupermercadoId));

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarProdutoRequest req)
        {
            if (!TemPermissao("produtos.criar")) return Proibido();
            var p = await service.CriarAsync(req, UsuarioId);
            return CreatedAtAction(nameof(ObterPorId), new { id = p.Id }, p);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] AtualizarProdutoRequest req)
        {
            if (!TemPermissao("produtos.editar")) return Proibido();
            return Ok(await service.AtualizarAsync(id, req));
        }

        [HttpPatch("{id:int}/promocao")]
        public async Task<IActionResult> Promocao(int id, [FromBody] PromocaoRequest req)
        {
            if (!TemPermissao("produtos.editar")) return Proibido();
            await service.AtualizarPromocaoAsync(id, req);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Deletar(int id)
        {
            if (!TemPermissao("produtos.deletar")) return Proibido();
            await service.DeletarAsync(id);
            return NoContent();
        }
    }
}
