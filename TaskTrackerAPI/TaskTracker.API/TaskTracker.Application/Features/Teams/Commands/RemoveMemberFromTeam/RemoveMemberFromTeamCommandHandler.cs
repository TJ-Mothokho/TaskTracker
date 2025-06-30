using System;
using MediatR;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Teams.Commands.RemoveMemberFromTeam;

/// <summary>
/// Handler for RemoveMemberFromTeamCommand that processes member removal requests
/// Implements business logic for removing individual members from existing teams
/// Includes validation to ensure entities exist and user is actually a team member
/// </summary>
public class RemoveMemberFromTeamCommandHandler : IRequestHandler<RemoveMemberFromTeamCommand, bool>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="teamRepository">Repository for team data operations</param>
    /// <param name="userRepository">Repository for user validation</param>
    public RemoveMemberFromTeamCommandHandler(ITeamRepository teamRepository, IUserRepository userRepository)
    {
        _teamRepository = teamRepository;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Handles the process of removing a member from a team
    /// 1. Validates that both team and user exist
    /// 2. Checks if user is actually a member of the team
    /// 3. Prevents removal of team owner (business rule)
    /// 4. Removes the user from team's member collection
    /// 5. Saves changes and returns success status
    /// </summary>
    /// <param name="request">The command containing team and user IDs</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Boolean indicating success of the operation</returns>
    /// <exception cref="ArgumentException">Thrown when team or user doesn't exist</exception>
    /// <exception cref="InvalidOperationException">Thrown when user is not a member or is the owner</exception>
    public async Task<bool> Handle(RemoveMemberFromTeamCommand request, CancellationToken cancellationToken)
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

        // Step 3: Check if user is the team owner
        // Business rule: Team owners cannot be removed as members
        // They must transfer ownership first or delete the team
        if (team.Owner == request.UserId)
        {
            throw new InvalidOperationException("Cannot remove team owner from team. Transfer ownership first or delete the team.");
        }

        // Step 4: Find the member in the team's member collection
        var memberToRemove = team.Members.FirstOrDefault(m => m.Id == request.UserId);
        if (memberToRemove == null)
        {
            throw new InvalidOperationException($"User {request.UserId} is not a member of team {request.TeamId}.");
        }

        // Step 5: Remove the user from the team's member collection
        team.Members.Remove(memberToRemove);

        // Step 6: Save the updated team to persist the membership change
        var updatedTeam = await _teamRepository.UpdateTeamAsync(team);

        // Step 7: Return success status
        // True indicates the member was successfully removed
        return updatedTeam != null;
    }
}
