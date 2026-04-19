using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTemp.DTOs.Input
{
    // ──────────────────────────────────────────────
    // Paginação
    // ──────────────────────────────────────────────
    public record PagedResult<T>(
        List<T> Dados, int Total, int Pagina, int TamanhoPagina)
    {
        public int TotalPaginas => (int)Math.Ceiling((double)Total / TamanhoPagina);
    }
}
