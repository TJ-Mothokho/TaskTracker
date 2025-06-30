using System;
using MediatR;
using TaskTracker.Application.DTOs.Teams;

namespace TaskTracker.Application.Features.Teams.Queries.GetTeamById;

/// <summary>
/// Query to retrieve a specific team by its unique identifier
/// Follows CQRS pattern using MediatR for query processing
/// Returns detailed team information including owner and members
/// </summary>
public record GetTeamByIdQuery : IRequest<TeamResponseDto>
{
    /// <summary>
    /// Unique identifier of the team to retrieve
    /// Used to locate the specific team in the database
    /// </summary>
    public required Guid TeamId { get; init; }
}
