using System;
using MediatR;

namespace TaskTracker.Application.Features.Todos.Commands.AssignTodoToUser;

/// <summary>
/// Command to assign an existing todo/task to a specific user
/// Provides functionality to reassign tasks or assign unassigned tasks
/// Follows CQRS pattern using MediatR for command processing
/// </summary>
public record AssignTodoToUserCommand : IRequest<bool>
{
    /// <summary>
    /// Unique identifier of the todo/task to be assigned
    /// </summary>
    public required Guid TodoId { get; init; }

    /// <summary>
    /// Unique identifier of the user to whom the todo should be assigned
    /// The user must exist in the system and have access to the todo (if team-based)
    /// </summary>
    public required Guid UserId { get; init; }

    /// <summary>
    /// Unique identifier of the user requesting the assignment
    /// Used for authorization - only creators or team members can assign tasks
    /// </summary>
    public required Guid RequestingUserId { get; init; }
}
