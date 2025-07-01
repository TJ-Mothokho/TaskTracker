using System;
using MediatR;

namespace TaskTracker.Application.Features.Teams.Commands.AddMemberToTeam;

/// <summary>
/// Command to add a new member to an existing team
/// Provides functionality to expand team membership without replacing entire member list
/// Follows CQRS pattern using MediatR for command processing
/// </summary>
public record AddMemberToTeamCommand : IRequest<bool>
{
    /// <summary>
    /// Unique identifier of the team to add the member to
    /// </summary>
    public required Guid TeamId { get; init; }

    /// <summary>
    /// Unique identifier of the user to be added as team member
    /// The user must exist in the system and not already be a member
    /// </summary>
    public required Guid UserId { get; init; }
}
