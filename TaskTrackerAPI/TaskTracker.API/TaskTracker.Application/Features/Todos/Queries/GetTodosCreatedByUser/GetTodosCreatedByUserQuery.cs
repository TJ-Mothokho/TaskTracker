using System;
using MediatR;
using TaskTracker.Application.DTOs.Todos;

namespace TaskTracker.Application.Features.Todos.Queries.GetTodosCreatedByUser;

/// <summary>
/// Query to retrieve all todos/tasks created by a specific user
/// This returns todos where the user is the creator/author
/// Follows CQRS pattern using MediatR for query processing
/// </summary>
public record GetTodosCreatedByUserQuery : IRequest<IEnumerable<TodoResponseDto>>
{
    /// <summary>
    /// Unique identifier of the user whose created todos should be retrieved
    /// Used to find all todos where this user is the creator
    /// </summary>
    public required Guid UserId { get; init; }
}
