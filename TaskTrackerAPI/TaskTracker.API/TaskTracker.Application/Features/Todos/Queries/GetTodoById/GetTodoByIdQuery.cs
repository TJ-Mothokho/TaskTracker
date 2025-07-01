using System;
using MediatR;
using TaskTracker.Application.DTOs.Todos;

namespace TaskTracker.Application.Features.Todos.Queries.GetTodoById;

/// <summary>
/// Query to retrieve a specific todo/task by its unique identifier
/// Follows CQRS pattern using MediatR for query processing
/// Returns detailed todo information including creator, assignee, and team details
/// </summary>
public record GetTodoByIdQuery : IRequest<TodoResponseDto>
{
    /// <summary>
    /// Unique identifier of the todo/task to retrieve
    /// Used to locate the specific todo in the database
    /// </summary>
    public required Guid TodoId { get; init; }
}
