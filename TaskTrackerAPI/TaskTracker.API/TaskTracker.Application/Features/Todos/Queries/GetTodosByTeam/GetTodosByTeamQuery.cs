using System;
using MediatR;
using TaskTracker.Application.DTOs.Todos;

namespace TaskTracker.Application.Features.Todos.Queries.GetTodosByTeam;

/// <summary>
/// Query to retrieve all todos/tasks belonging to a specific team
/// This returns todos that are associated with a team, useful for team workflow management
/// Follows CQRS pattern using MediatR for query processing
/// </summary>
public record GetTodosByTeamQuery : IRequest<IEnumerable<TodoResponseDto>>
{
    /// <summary>
    /// Unique identifier of the user requesting the team todos
    /// Used to validate that the user has access to view the team's todos
    /// </summary>
    public required Guid UserId { get; init; }

    /// <summary>
    /// Unique identifier of the team whose todos should be retrieved
    /// Used to find all todos where TeamID matches this value
    /// </summary>
    public required Guid TeamId { get; init; }
}
