using CommonTemp.DTOs.Input;
using Microsoft.AspNetCore.Mvc;
using SuperMercadoApi.Server.Interfaces;

namespace SuperMercadoApi.Server.Controllers
{
    // ── Usuários ───────────────────────────────────
    [Route("api/usuarios")]
    public class UsuariosController(IUsuarioService service) : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> Listar() =>
            Ok(await service.ListarAsync(SupermercadoId));

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarUsuarioRequest req)
        {
            if (!TemPermissao("usuarios.criar")) return Proibido();
            return Ok(await service.CriarAsync(req));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] AtualizarUsuarioRequest req)
        {
            if (!TemPermissao("usuarios.editar")) return Proibido();
            return Ok(await service.AtualizarAsync(id, req));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Deletar(int id)
        {
            if (!TemPermissao("usuarios.editar")) return Proibido();
            await service.DeletarAsync(id);
            return NoContent();
        }

        [HttpPost("{id:int}/senha")]
        public async Task<IActionResult> AlterarSenha(int id, [FromBody] AlterarSenhaRequest req)
        {
            if (id != UsuarioId && !TemPermissao("usuarios.editar")) return Proibido();
            await service.AlterarSenhaAsync(id, req.NovaSenha);
            return NoContent();
        }
    }

    public record AlterarSenhaRequest(string NovaSenha);
}
