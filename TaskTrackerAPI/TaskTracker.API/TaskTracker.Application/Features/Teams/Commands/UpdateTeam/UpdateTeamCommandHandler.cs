using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Teams;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Teams.Commands.UpdateTeam;

/// <summary>
/// Handler for UpdateTeamCommand that processes team update requests
/// Implements business logic for updating team properties including name, owner, and members
/// Uses selective updating - only modifies properties that are provided in the command
/// </summary>
public class UpdateTeamCommandHandler : IRequestHandler<UpdateTeamCommand, TeamResponseDto>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="teamRepository">Repository for team data operations</param>
    /// <param name="userRepository">Repository for user validation operations</param>
    /// <param name="mapper">AutoMapper for entity to DTO conversion</param>
    public UpdateTeamCommandHandler(ITeamRepository teamRepository, IUserRepository userRepository, IMapper mapper)
    {
        _teamRepository = teamRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the team update process with selective property updates
    /// 1. Retrieves the existing team from database
    /// 2. Updates only the properties that are provided (non-null)
    /// 3. Validates new owner and members if they are being changed
    /// 4. Saves the updated team and returns the result
    /// </summary>
    /// <param name="request">The update team command containing new values</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>TeamResponseDto containing the updated team information</returns>
    /// <exception cref="ArgumentException">Thrown when team is not found</exception>
    /// <exception cref="InvalidOperationException">Thrown when new owner or members don't exist</exception>
    public async Task<TeamResponseDto> Handle(UpdateTeamCommand request, CancellationToken cancellationToken)
    {
        // Step 1: Retrieve the existing team from database
        // This ensures we're updating a team that actually exists
        var existingTeam = await _teamRepository.GetTeamByIdAsync(request.Id);
        if (existingTeam == null)
        {
            throw new ArgumentException($"Team with ID {request.Id} not found.");
        }

        // Step 2: Update team name if a new name is provided
        // Only modify the name if it's explicitly provided in the request
        if (!string.IsNullOrEmpty(request.Name))
        {
            existingTeam.Name = request.Name;
        }

        // Step 3: Update team owner if a new owner is specified
        // Validate that the new owner exists before making the change
        if (request.OwnerId.HasValue)
        {
            var newOwner = await _userRepository.GetUserByIdAsync(request.OwnerId.Value);
            if (newOwner == null)
            {
                throw new InvalidOperationException($"New owner with ID {request.OwnerId} not found.");
            }
            
            // Update both the owner ID and the navigation property
            existingTeam.Owner = request.OwnerId.Value;
            existingTeam.User = newOwner;
        }

        // Step 4: Update team members if a new member list is provided
        // This replaces the entire member list with the new one
        if (request.MemberIds != null)
        {
            // Clear existing members first
            existingTeam.Members.Clear();
            
            // Add new members if any are specified
            if (request.MemberIds.Any())
            {
                // Validate all new members exist before adding any
                var newMembers = new List<User>();
                foreach (var memberId in request.MemberIds)
                {
                    var member = await _userRepository.GetUserByIdAsync(memberId);
                    if (member == null)
                    {
                        throw new InvalidOperationException($"Member with ID {memberId} not found.");
                    }
                    newMembers.Add(member);
                }
                
                // Add all validated members to the team
                foreach (var member in newMembers)
                {
                    existingTeam.Members.Add(member);
                }
            }
        }

        // Step 5: Save the updated team to the database
        // The repository handles the persistence and any related updates
        var updatedTeam = await _teamRepository.UpdateTeamAsync(existingTeam);

        // Step 6: Convert the updated team entity to response DTO
        // AutoMapper handles the conversion including nested objects
        return _mapper.Map<TeamResponseDto>(updatedTeam);
    }
}
