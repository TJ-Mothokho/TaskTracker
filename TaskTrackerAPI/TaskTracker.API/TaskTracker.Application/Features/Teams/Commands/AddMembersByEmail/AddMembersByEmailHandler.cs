using System;
using MediatR;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Teams.Commands.AddMembersByEmail;

/// <summary>
/// Handler for adding multiple members to a team using their email addresses
/// Validates that all emails exist as users and adds them to the team
/// </summary>
public class AddMembersByEmailHandler : IRequestHandler<AddMembersByEmailCommand, bool>
{
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;

    public AddMembersByEmailHandler(ITeamRepository teamRepository, IUserRepository userRepository)
    {
        _teamRepository = teamRepository;
        _userRepository = userRepository;
    }

    public async Task<bool> Handle(AddMembersByEmailCommand request, CancellationToken cancellationToken)
    {
        // Validate that the team exists
        var team = await _teamRepository.GetTeamByIdAsync(request.TeamId);
        if (team == null)
        {
            throw new ArgumentException($"Team with ID {request.TeamId} not found");
        }

        // Get all users by email addresses
        var users = new List<Domain.Entities.User>();
        var notFoundEmails = new List<string>();

        foreach (var email in request.Emails)
        {
            try
            {
                var user = await _userRepository.GetUserByEmailAsync(email);
                if (user != null)
                {
                    users.Add(user);
                }
            }
            catch (NullReferenceException)
            {
                notFoundEmails.Add(email);
            }
        }

        // If any emails were not found, throw an exception
        if (notFoundEmails.Any())
        {
            throw new ArgumentException($"Users not found for emails: {string.Join(", ", notFoundEmails)}");
        }

        // Check if any users are already members
        var existingMemberIds = team.Members.Select(m => m.Id).ToHashSet();
        var newUsers = users.Where(u => !existingMemberIds.Contains(u.Id)).ToList();

        if (!newUsers.Any())
        {
            throw new InvalidOperationException("All users are already members of this team");
        }

        // Add each new user to the team's member collection
        foreach (var user in newUsers)
        {
            team.Members.Add(user);
        }

        // Save the updated team to persist the new memberships
        var updatedTeam = await _teamRepository.UpdateTeamAsync(team);

        return updatedTeam != null;
    }
}
