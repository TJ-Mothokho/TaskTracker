using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Teams;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Teams.Commands.CreateTeam;

/// <summary>
/// Handler for CreateTeamCommand that processes team creation requests
/// Implements the business logic for creating a new team with owner and members
/// Follows the Command Handler pattern with MediatR
/// </summary>
public class CreateTeamCommandHandler : IRequestHandler<CreateTeamCommand, TeamResponseDto>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="teamRepository">Repository for team data operations</param>
    /// <param name="userRepository">Repository for user data operations - needed to validate owner and members</param>
    /// <param name="mapper">AutoMapper for entity to DTO conversion</param>
    public CreateTeamCommandHandler(ITeamRepository teamRepository, IUserRepository userRepository, IMapper mapper)
    {
        _teamRepository = teamRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the team creation process
    /// 1. Validates that the owner exists
    /// 2. Validates that all specified members exist
    /// 3. Creates the team entity
    /// 4. Adds members to the team if specified
    /// 5. Saves to database and returns the created team data
    /// </summary>
    /// <param name="request">The create team command containing team details</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>TeamResponseDto containing the created team information</returns>
    /// <exception cref="ArgumentException">Thrown when owner doesn't exist</exception>
    /// <exception cref="InvalidOperationException">Thrown when specified members don't exist</exception>
    public async Task<TeamResponseDto> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
    {
        // Step 1: Validate that the owner exists in the system
        // This ensures we don't create orphaned teams
        var owner = await _userRepository.GetUserByIdAsync(request.OwnerId);
        if (owner == null)
        {
            throw new ArgumentException($"Owner with ID {request.OwnerId} not found.");
        }

        // Step 2: Create the team entity from the command data
        // Map the command properties to a new Team domain entity
        var team = new Team
        {
            Id = Guid.NewGuid(), // Generate new unique identifier
            Name = request.Name,
            Owner = request.OwnerId,
            User = owner, // Set the owner relationship
            Members = new List<User>(), // Initialize empty members collection
            Tasks = new List<Todo>(), // Initialize empty tasks collection
            Status = "Active", // Set default status from BaseClass
            CreatedAt = DateTime.UtcNow // Set creation timestamp
        };

        // Step 3: Process member additions if any members were specified
        if (request.MemberIds != null && request.MemberIds.Any())
        {
            // Validate all specified members exist before adding any
            foreach (var memberId in request.MemberIds)
            {
                var member = await _userRepository.GetUserByIdAsync(memberId);
                if (member == null)
                {
                    throw new InvalidOperationException($"Member with ID {memberId} not found.");
                }
                
                // Add valid member to the team's members collection
                team.Members.Add(member);
            }
        }

        // Step 4: Save the new team to the database
        // The repository handles the actual persistence logic
        var createdTeam = await _teamRepository.AddTeamAsync(team);

        // Step 5: Convert the created team entity to response DTO
        // AutoMapper handles the mapping including nested objects (Owner, Members)
        return _mapper.Map<TeamResponseDto>(createdTeam);
    }
}
