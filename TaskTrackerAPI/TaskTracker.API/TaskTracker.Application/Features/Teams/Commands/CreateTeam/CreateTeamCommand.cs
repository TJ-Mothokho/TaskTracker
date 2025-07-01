using System;
using MediatR;
using TaskTracker.Application.DTOs.Teams;

namespace TaskTracker.Application.Features.Teams.Commands.CreateTeam;

/// <summary>
/// Command to create a new team in the system
/// This follows the CQRS pattern using MediatR for command handling
/// The command contains all necessary data to create a team including owner and optional members
/// </summary>
public record CreateTeamCommand : IRequest<TeamResponseDto>
{
    /// <summary>
    /// Name of the team to be created
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// ID of the user who will own/manage this team
    /// </summary>
    public required Guid OwnerId { get; set; }

    /// <summary>
    /// Optional list of user IDs to be added as team members
    /// Can be null or empty if creating team without initial members
    /// </summary>
    public List<Guid>? MemberIds { get; set; }
}
