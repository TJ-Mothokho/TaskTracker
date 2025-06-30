using System.Security.Claims;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    Task<bool> ValidateRefreshTokenAsync(string email, string refreshToken);
    Task<User> SaveRefreshTokenAsync(User user, string refreshToken);
}
