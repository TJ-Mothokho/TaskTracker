using System;

namespace TaskTracker.Application.DTOs.Users;

public class UserResponseDto
{
    public Guid Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }
}

