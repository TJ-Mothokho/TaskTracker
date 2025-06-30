using MediatR;
using TaskTracker.Application.DTOs.Auth;
using TaskTracker.Application.Interfaces;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Auth;

public class RefreshTokenCommand : IRequest<RefreshTokenResponseDto>
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public RefreshTokenCommandHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<RefreshTokenResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Get principal from expired token
        var principal = _jwtService.GetPrincipalFromExpiredToken(request.AccessToken);
        var email = principal.FindFirst("email")?.Value ?? principal.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            throw new UnauthorizedAccessException("Invalid token");
        }

        // Validate refresh token
        if (!await _jwtService.ValidateRefreshTokenAsync(email, request.RefreshToken))
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        // Get user
        var user = await _userRepository.GetUserByEmailAsync(email);

        // Generate new tokens
        var newAccessToken = _jwtService.GenerateAccessToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        // Save new refresh token
        await _jwtService.SaveRefreshTokenAsync(user, newRefreshToken);

        // Calculate expiry times
        var accessTokenExpiry = DateTime.UtcNow.AddMinutes(60); // This should come from config
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);    // This should come from config

        return new RefreshTokenResponseDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            AccessTokenExpiry = accessTokenExpiry,
            RefreshTokenExpiry = refreshTokenExpiry
        };
    }
}
