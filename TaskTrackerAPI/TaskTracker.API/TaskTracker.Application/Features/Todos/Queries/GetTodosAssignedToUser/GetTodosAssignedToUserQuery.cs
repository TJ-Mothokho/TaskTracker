using System;
using MediatR;
using TaskTracker.Application.DTOs.Todos;

namespace TaskTracker.Application.Features.Todos.Queries.GetTodosAssignedToUser;

/// <summary>
/// Query to retrieve all todos/tasks assigned to a specific user
/// This returns todos where the user is the assignee (responsible for completion)
/// Follows CQRS pattern using MediatR for query processing
/// </summary>
public record GetTodosAssignedToUserQuery : IRequest<IEnumerable<TodoResponseDto>>
{
    /// <summary>
    /// Unique identifier of the user whose assigned todos should be retrieved
    /// Used to find all todos where this user is the assignee
    /// </summary>
    public required Guid UserId { get; init; }
}
