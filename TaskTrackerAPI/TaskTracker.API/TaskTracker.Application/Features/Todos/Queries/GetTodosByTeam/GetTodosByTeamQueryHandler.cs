using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Todos;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Todos.Queries.GetTodosByTeam;

/// <summary>
/// Handler for GetTodosByTeamQuery that retrieves todos belonging to a specific team
/// Implements query processing logic for fetching team-based todos with access control
/// Returns todos associated with a team, ensuring the requesting user has appropriate access
/// </summary>
public class GetTodosByTeamQueryHandler : IRequestHandler<GetTodosByTeamQuery, IEnumerable<TodoResponseDto>>
{
    private readonly ITodoRepository _todoRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="todoRepository">Repository for todo data retrieval operations</param>
    /// <param name="teamRepository">Repository for team validation and access control</param>
    /// <param name="userRepository">Repository for user validation</param>
    /// <param name="mapper">AutoMapper for entity to DTO conversion</param>
    public GetTodosByTeamQueryHandler(
        ITodoRepository todoRepository, 
        ITeamRepository teamRepository, 
        IUserRepository userRepository, 
        IMapper mapper)
    {
        _todoRepository = todoRepository;
        _teamRepository = teamRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the team todos retrieval process with access control validation
    /// 1. Validates that the user exists in the system
    /// 2. Validates that the team exists
    /// 3. Verifies that the user has access to view the team's todos
    /// 4. Retrieves all todos belonging to the team
    /// 5. Maps todo entities to response DTOs
    /// 6. Returns the complete list of team todos
    /// </summary>
    /// <param name="request">The query containing user ID and team ID</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Collection of TodoResponseDto containing all todos belonging to the team</returns>
    /// <exception cref="ArgumentException">Thrown when user or team is not found</exception>
    /// <exception cref="UnauthorizedAccessException">Thrown when user doesn't have access to team</exception>
    public async Task<IEnumerable<TodoResponseDto>> Handle(GetTodosByTeamQuery request, CancellationToken cancellationToken)
    {
        // Step 1: Validate that the user exists
        // This ensures we don't perform operations for invalid users
        var user = await _userRepository.GetUserByIdAsync(request.UserId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {request.UserId} not found.");
        }

        // Step 2: Validate that the team exists
        // This ensures we don't try to fetch todos for non-existent teams
        var team = await _teamRepository.GetTeamByIdAsync(request.TeamId);
        if (team == null)
        {
            throw new ArgumentException($"Team with ID {request.TeamId} not found.");
        }

        // Step 3: Verify that the user has access to view the team's todos
        // Access control: User must be either the team owner or a team member
        var userHasTeamAccess = team.Owner == request.UserId || 
                               team.Members.Any(m => m.Id == request.UserId);
        if (!userHasTeamAccess)
        {
            throw new UnauthorizedAccessException($"User {request.UserId} does not have access to view todos for team {request.TeamId}.");
        }

        // Step 4: Retrieve all todos belonging to the team
        // The repository method should return todos where TeamID = request.TeamId
        // This includes todos created by any team member and assigned to the team
        var teamTodos = await _todoRepository.GetTasksByTeamAsync(request.UserId, request.TeamId);

        // Step 5: Map todo entities to response DTOs
        // AutoMapper handles the conversion for each todo including:
        // - Todo basic information (ID, Title, Description, Priority, DueDate, Status)
        // - Creator details (team member who created the todo)
        // - Assignee details (team member assigned to the todo, if any)
        // - Team information (the team these todos belong to)
        var todoDtos = _mapper.Map<IEnumerable<TodoResponseDto>>(teamTodos);

        // Step 6: Return the mapped todo collection
        // Returns empty collection if team has no todos
        return todoDtos;
    }
}
