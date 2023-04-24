using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddlware
    {
        private readonly IHostEnvironment _env;
        private readonly ILogger<ExceptionMiddlware> _logger;
        private readonly RequestDelegate _next;
        public ExceptionMiddlware(RequestDelegate next, ILogger<ExceptionMiddlware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                var responce = new ProblemDetails
                {
                    Status = 500,
                    Detail = _env.IsDevelopment()? ex.StackTrace?.ToString() : null,
                    Title = ex.Message,
                };

                var option = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(responce, option);

                await context.Response.WriteAsync(json);
            }
        }
    }
}