using System;
using MediatR;
using TaskTracker.Application.DTOs.Teams;

namespace TaskTracker.Application.Features.Teams.Queries.GetUserTeams;

/// <summary>
/// Query to retrieve all teams associated with a specific user
/// This includes teams where the user is either:
/// - The owner/creator of the team
/// - A member of the team
/// Follows CQRS pattern using MediatR for query processing
/// </summary>
public record GetUserTeamsQuery : IRequest<IEnumerable<TeamResponseDto>>
{
    /// <summary>
    /// Unique identifier of the user whose teams should be retrieved
    /// Used to find all teams where this user has any association
    /// </summary>
    public required Guid UserId { get; init; }
}
