using MediatR;
using TaskTracker.Application.DTOs.Auth;
using TaskTracker.Application.Interfaces;
using TaskTracker.Domain.Interfaces;
using TaskTracker.Domain.Entities;
using BCrypt.Net;

namespace TaskTracker.Application.Features.Auth;

public class RegisterCommand : IRequest<LoginResponseDto>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, LoginResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public RegisterCommandHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        try
        {
            await _userRepository.GetUserByEmailAsync(request.Email);
            throw new InvalidOperationException("User with this email already exists");
        }
        catch (NullReferenceException)
        {
            // This is expected when user doesn't exist, continue with registration
        }

        // Hash the password
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create new user
        var newUser = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Password = hashedPassword
        };

        // Save user to database
        var createdUser = await _userRepository.AddUserAsync(newUser);

        // Generate tokens
        var accessToken = _jwtService.GenerateAccessToken(createdUser);
        var refreshToken = _jwtService.GenerateRefreshToken();

        // Save refresh token to database
        await _jwtService.SaveRefreshTokenAsync(createdUser, refreshToken);

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
                Id = createdUser.Id,
                FirstName = createdUser.FirstName,
                LastName = createdUser.LastName,
                Email = createdUser.Email
            }
        };
    }
}
