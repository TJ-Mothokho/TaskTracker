using System;
using MediatR;

namespace TaskTracker.Application.Features.Teams.Commands.RemoveMemberFromTeam;

/// <summary>
/// Command to remove an existing member from a team
/// Provides functionality to reduce team membership without affecting other members
/// Follows CQRS pattern using MediatR for command processing
/// </summary>
public record RemoveMemberFromTeamCommand : IRequest<bool>
{
    /// <summary>
    /// Unique identifier of the team to remove the member from
    /// </summary>
    public required Guid TeamId { get; init; }

    /// <summary>
    /// Unique identifier of the user to be removed from team membership
    /// The user must currently be a member of the specified team
    /// </summary>
    public required Guid UserId { get; init; }
}
