using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Teams;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Teams.Queries.GetTeamById;

/// <summary>
/// Handler for GetTeamByIdQuery that retrieves a specific team's details
/// Implements query processing logic for fetching team information by ID
/// Returns complete team data including related entities (owner, members)
/// </summary>
public class GetTeamByIdQueryHandler : IRequestHandler<GetTeamByIdQuery, TeamResponseDto>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="teamRepository">Repository for team data retrieval operations</param>
    /// <param name="mapper">AutoMapper for entity to DTO conversion</param>
    public GetTeamByIdQueryHandler(ITeamRepository teamRepository, IMapper mapper)
    {
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the team retrieval process
    /// 1. Fetches the team from the database using the provided ID
    /// 2. Validates that the team exists
    /// 3. Maps the team entity to a response DTO
    /// 4. Returns the complete team information
    /// </summary>
    /// <param name="request">The query containing the team ID to retrieve</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>TeamResponseDto containing the team details, owner info, and member list</returns>
    /// <exception cref="ArgumentException">Thrown when team with specified ID is not found</exception>
    public async Task<TeamResponseDto> Handle(GetTeamByIdQuery request, CancellationToken cancellationToken)
    {
        // Step 1: Retrieve the team from the database
        // The repository should include related entities (Owner, Members) for complete data
        var team = await _teamRepository.GetTeamByIdAsync(request.TeamId);
        
        // Step 2: Validate that the team exists
        // Provide clear error message if team is not found
        if (team == null)
        {
            throw new ArgumentException($"Team with ID {request.TeamId} not found.");
        }

        // Step 3: Map the team entity to response DTO
        // AutoMapper handles the conversion including nested objects:
        // - Team basic info (ID, Name, Status, CreatedAt)
        // - Owner information (mapped to UserResponseDto)
        // - Members list (mapped to List<UserResponseDto>)
        return _mapper.Map<TeamResponseDto>(team);
    }
}
