using System;
using MediatR;

namespace TaskTracker.Application.Features.Todos.Commands.UnassignTodo;

/// <summary>
/// Command to unassign a todo/task from its current assignee
/// Provides functionality to remove assignment and make the task available for reassignment
/// Follows CQRS pattern using MediatR for command processing
/// </summary>
public record UnassignTodoCommand : IRequest<bool>
{
    /// <summary>
    /// Unique identifier of the todo/task to be unassigned
    /// </summary>
    public required Guid TodoId { get; init; }

    /// <summary>
    /// Unique identifier of the user requesting the unassignment
    /// Used for authorization - only creators, current assignees, or team members can unassign
    /// </summary>
    public required Guid RequestingUserId { get; init; }
}
