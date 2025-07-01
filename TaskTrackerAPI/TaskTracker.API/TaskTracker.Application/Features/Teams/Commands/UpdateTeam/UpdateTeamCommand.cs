using System;
using MediatR;
using TaskTracker.Application.DTOs.Teams;

namespace TaskTracker.Application.Features.Teams.Commands.UpdateTeam;

/// <summary>
/// Command to update an existing team's information
/// Follows CQRS pattern using MediatR for command processing
/// Allows updating team name, owner, and member list
/// </summary>
public record UpdateTeamCommand : IRequest<TeamResponseDto>
{
    /// <summary>
    /// Unique identifier of the team to be updated
    /// This is required to locate the specific team in the database
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// New name for the team (optional)
    /// If null, the team name will remain unchanged
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// New owner ID for the team (optional)
    /// If null, the team ownership will remain unchanged
    /// The new owner must be an existing user in the system
    /// </summary>
    public Guid? OwnerId { get; set; }

    /// <summary>
    /// New list of member IDs for the team (optional)
    /// If null, the team members will remain unchanged
    /// If provided, this will replace the entire member list (not append)
    /// All specified member IDs must correspond to existing users
    /// </summary>
    public List<Guid>? MemberIds { get; set; }
}
