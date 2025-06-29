using System;

namespace TaskTracker.Application.DTOs.Users;

public class LoginRequestDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}
