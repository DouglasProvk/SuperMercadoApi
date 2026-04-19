using CommonTemp.DTOs.Input;

namespace SuperMercadoApi.Server.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<LoginResponse> RefreshTokenAsync(string token);
        Task RevogarTokenAsync(string token);
    }
}
