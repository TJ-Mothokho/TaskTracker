using MediatR;
using TaskTracker.Application.DTOs.Auth;
using TaskTracker.Application.Interfaces;
using TaskTracker.Domain.Interfaces;
using BCrypt.Net;

namespace TaskTracker.Application.Features.Auth;

public class LoginQuery : IRequest<LoginResponseDto>
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class LoginQueryHandler : IRequestHandler<LoginQuery, LoginResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public LoginQueryHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        // Get user by email first
        var user = await _userRepository.GetUserByEmailAsync(request.Email);
        
        // Verify password using BCrypt
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        // Save refresh token to database
        await _jwtService.SaveRefreshTokenAsync(user, refreshToken);

        // Calculate expiry times
        var accessTokenExpiry = DateTime.UtcNow.AddMinutes(60); // This should come from config
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);    // This should come from config

        return new LoginResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiry = accessTokenExpiry,
            RefreshTokenExpiry = refreshTokenExpiry,
            User = new UserInfoDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            }
        };
    }
}
