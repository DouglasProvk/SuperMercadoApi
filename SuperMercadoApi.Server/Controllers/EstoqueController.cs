using CommonTemp.DTOs.Input;
using Microsoft.AspNetCore.Mvc;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Estoque ────────────────────────────────────
    [Route("api/estoque")]
    public class EstoqueController(IEstoqueService service) : BaseController
    {
        [HttpPost("movimentar")]
        public async Task<IActionResult> Movimentar([FromBody] MovimentacaoRequest req)
        {
            if (!TemPermissao("estoque.movimentar")) return Proibido();
            return Ok(await service.MovimentarAsync(req, UsuarioId));
        }

        [HttpGet("historico/{produtoId:int}")]
        public async Task<IActionResult> Historico(int produtoId,
            [FromQuery] int pagina = 1, [FromQuery] int tamanho = 50) =>
            Ok(await service.HistoricoAsync(produtoId, pagina, tamanho));

        [HttpGet("historico")]
        public async Task<IActionResult> HistoricoGeral(
            [FromQuery] DateTime? de = null, [FromQuery] DateTime? ate = null) =>
            Ok(await service.HistoricoSupermercadoAsync(SupermercadoId, de, ate));
    }
}
