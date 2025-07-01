using System;
using MediatR;

namespace TaskTracker.Application.Features.Teams.Commands.DeleteTeam;

/// <summary>
/// Command to delete an existing team from the system
/// Follows CQRS pattern using MediatR for command processing
/// Returns boolean indicating success/failure of deletion operation
/// </summary>
public record DeleteTeamCommand : IRequest<bool>
{
    /// <summary>
    /// Unique identifier of the team to be deleted
    /// This is used to locate the specific team in the database
    /// </summary>
    public required Guid Id { get; set; }
}
