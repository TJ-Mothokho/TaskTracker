using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Teams;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Teams.Queries.GetUserTeams;

/// <summary>
/// Handler for GetUserTeamsQuery that retrieves all teams associated with a user
/// Implements query processing logic for fetching user's team associations
/// Returns teams where user is owner or member, providing complete team details
/// </summary>
public class GetUserTeamsQueryHandler : IRequestHandler<GetUserTeamsQuery, IEnumerable<TeamResponseDto>>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="teamRepository">Repository for team data retrieval operations</param>
    /// <param name="userRepository">Repository for user validation</param>
    /// <param name="mapper">AutoMapper for entity to DTO conversion</param>
    public GetUserTeamsQueryHandler(ITeamRepository teamRepository, IUserRepository userRepository, IMapper mapper)
    {
        _teamRepository = teamRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the user teams retrieval process
    /// 1. Validates that the user exists in the system
    /// 2. Retrieves all teams associated with the user (owned + member of)
    /// 3. Maps team entities to response DTOs
    /// 4. Returns the complete list of user's teams
    /// </summary>
    /// <param name="request">The query containing the user ID</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Collection of TeamResponseDto containing all teams associated with the user</returns>
    /// <exception cref="ArgumentException">Thrown when user with specified ID is not found</exception>
    public async Task<IEnumerable<TeamResponseDto>> Handle(GetUserTeamsQuery request, CancellationToken cancellationToken)
    {
        // Step 1: Validate that the user exists
        // This ensures we don't perform unnecessary database operations for invalid users
        var user = await _userRepository.GetUserByIdAsync(request.UserId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {request.UserId} not found.");
        }

        // Step 2: Retrieve all teams associated with the user
        // The repository method should return teams where the user is:
        // - The owner/creator (Owner = UserId)
        // - A member (exists in Members collection)
        // This provides a complete view of user's team associations
        var userTeams = await _teamRepository.GetTeamsAsync(request.UserId);

        // Step 3: Map team entities to response DTOs
        // AutoMapper handles the conversion for each team including:
        // - Team basic information (ID, Name, Status, CreatedAt)
        // - Owner details (converted to UserResponseDto)
        // - Member list (converted to List<UserResponseDto>)
        var teamDtos = _mapper.Map<IEnumerable<TeamResponseDto>>(userTeams);

        // Step 4: Return the mapped team collection
        // Returns empty collection if user has no team associations
        return teamDtos;
    }
}
