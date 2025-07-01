using System;
using MediatR;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Teams.Commands.DeleteTeam;

/// <summary>
/// Handler for DeleteTeamCommand that processes team deletion requests
/// Implements business logic for safely removing teams from the system
/// Handles cascade deletion considerations for related entities
/// </summary>
public class DeleteTeamCommandHandler : IRequestHandler<DeleteTeamCommand, bool>
{
    private readonly ITeamRepository _teamRepository;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="teamRepository">Repository for team data operations</param>
    public DeleteTeamCommandHandler(ITeamRepository teamRepository)
    {
        _teamRepository = teamRepository;
    }

    /// <summary>
    /// Handles the team deletion process
    /// 1. Retrieves the team to ensure it exists
    /// 2. Performs the deletion operation
    /// 3. Returns success/failure status
    /// 
    /// Note: The actual cascade deletion logic (handling of related todos, member relationships)
    /// should be implemented at the repository/database level through foreign key constraints
    /// or explicit cascade delete operations
    /// </summary>
    /// <param name="request">The delete team command containing team ID</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Boolean indicating whether the deletion was successful</returns>
    /// <exception cref="ArgumentException">Thrown when team is not found</exception>
    public async Task<bool> Handle(DeleteTeamCommand request, CancellationToken cancellationToken)
    {
        // Step 1: Retrieve the team to ensure it exists before attempting deletion
        // This provides better error handling and prevents unnecessary database operations
        var teamToDelete = await _teamRepository.GetTeamByIdAsync(request.Id);
        if (teamToDelete == null)
        {
            throw new ArgumentException($"Team with ID {request.Id} not found.");
        }

        // Step 2: Perform the deletion operation
        // The repository should handle:
        // - Removing team-member relationships
        // - Handling any todos assigned to this team (either reassign or delete)
        // - Proper cleanup of foreign key relationships
        var deleteResult = await _teamRepository.DeleteTeamAsync(teamToDelete);

        // Step 3: Return the result of the deletion operation
        // True indicates successful deletion, false indicates failure
        return deleteResult;
    }
}
