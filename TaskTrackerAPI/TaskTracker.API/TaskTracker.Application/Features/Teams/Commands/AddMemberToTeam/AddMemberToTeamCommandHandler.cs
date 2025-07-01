using System;
using MediatR;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Teams.Commands.AddMemberToTeam;

/// <summary>
/// Handler for AddMemberToTeamCommand that processes member addition requests
/// Implements business logic for adding individual members to existing teams
/// Includes validation to prevent duplicate memberships and ensure entities exist
/// </summary>
public class AddMemberToTeamCommandHandler : IRequestHandler<AddMemberToTeamCommand, bool>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="teamRepository">Repository for team data operations</param>
    /// <param name="userRepository">Repository for user validation</param>
    public AddMemberToTeamCommandHandler(ITeamRepository teamRepository, IUserRepository userRepository)
    {
        _teamRepository = teamRepository;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Handles the process of adding a member to a team
    /// 1. Validates that both team and user exist
    /// 2. Checks if user is already a member to prevent duplicates
    /// 3. Adds the user to team's member collection
    /// 4. Saves changes and returns success status
    /// </summary>
    /// <param name="request">The command containing team and user IDs</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Boolean indicating success of the operation</returns>
    /// <exception cref="ArgumentException">Thrown when team or user doesn't exist</exception>
    /// <exception cref="InvalidOperationException">Thrown when user is already a team member</exception>
    public async Task<bool> Handle(AddMemberToTeamCommand request, CancellationToken cancellationToken)
    {
        // Step 1: Validate that the team exists
        var team = await _teamRepository.GetTeamByIdAsync(request.TeamId);
        if (team == null)
        {
            throw new ArgumentException($"Team with ID {request.TeamId} not found.");
        }

        // Step 2: Validate that the user exists
        var user = await _userRepository.GetUserByIdAsync(request.UserId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {request.UserId} not found.");
        }

        // Step 3: Check if user is already a member of the team
        // Prevent duplicate memberships which could cause data integrity issues
        var isAlreadyMember = team.Members.Any(m => m.Id == request.UserId);
        if (isAlreadyMember)
        {
            throw new InvalidOperationException($"User {request.UserId} is already a member of team {request.TeamId}.");
        }

        // Step 4: Add the user to the team's member collection
        team.Members.Add(user);

        // Step 5: Save the updated team to persist the new membership
        var updatedTeam = await _teamRepository.UpdateTeamAsync(team);

        // Step 6: Return success status
        // True indicates the member was successfully added
        return updatedTeam != null;
    }
}
