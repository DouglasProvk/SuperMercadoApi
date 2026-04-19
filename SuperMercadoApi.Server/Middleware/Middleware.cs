using System.Net;
using System.Text.Json;

namespace SuperMercadoApi.Server.Middleware
{
    public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Erro não tratado: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var (status, message) = ex switch
            {
                UnauthorizedAccessException => (HttpStatusCode.Unauthorized, ex.Message),
                KeyNotFoundException => (HttpStatusCode.NotFound, ex.Message),
                InvalidOperationException => (HttpStatusCode.BadRequest, ex.Message),
                ArgumentException => (HttpStatusCode.BadRequest, ex.Message),
                _ => (HttpStatusCode.InternalServerError, "Erro interno no servidor.")
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)status;

            var body = JsonSerializer.Serialize(new
            {
                erro = message,
                statusCode = (int)status,
                timestamp = DateTime.UtcNow
            });

            await context.Response.WriteAsync(body);
        }
    }
}
