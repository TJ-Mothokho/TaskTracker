using System;
using TaskTracker.Application.DTOs.Users;

namespace TaskTracker.Application.DTOs.Teams;

public class TeamResponseDto
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public UserResponseDto Owner { get; set; }

    public List<UserResponseDto> Members { get; set; } = new();
}

