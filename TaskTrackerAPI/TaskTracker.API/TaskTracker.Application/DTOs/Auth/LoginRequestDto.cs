using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Application.DTOs.Auth;

public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
}
