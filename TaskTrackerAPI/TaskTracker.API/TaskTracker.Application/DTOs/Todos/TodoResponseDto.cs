using System;
using TaskTracker.Application.DTOs.Teams;
using TaskTracker.Application.DTOs.Users;

namespace TaskTracker.Application.DTOs.Todos;

public class TodoResponseDto
{
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string? Description { get; set; }

    public Priority Priority { get; set; }

    public DateTime DueDate { get; set; }

    public string Status { get; set; }

    public UserResponseDto Creator { get; set; }

    public UserResponseDto? Assignee { get; set; }

    public TeamResponseDto? Team { get; set; }
}

