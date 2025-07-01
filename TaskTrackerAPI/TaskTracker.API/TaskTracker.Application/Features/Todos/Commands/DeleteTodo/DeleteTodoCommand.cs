using System;
using MediatR;

namespace TaskTracker.Application.Features.Todos.Commands.DeleteTodo;

/// <summary>
/// Command to delete an existing todo/task from the system
/// Follows CQRS pattern using MediatR for command processing
/// Returns boolean indicating success/failure of deletion operation
/// </summary>
public record DeleteTodoCommand : IRequest<bool>
{
    /// <summary>
    /// Unique identifier of the todo/task to be deleted
    /// This is used to locate the specific todo in the database
    /// </summary>
    public required Guid Id { get; set; }
}
