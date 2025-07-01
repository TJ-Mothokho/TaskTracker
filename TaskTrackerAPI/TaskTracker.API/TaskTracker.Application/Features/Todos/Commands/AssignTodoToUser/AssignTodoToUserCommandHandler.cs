using System;
using MediatR;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Todos.Commands.AssignTodoToUser;

/// <summary>
/// Handler for AssignTodoToUserCommand that processes todo assignment requests
/// Implements business logic for assigning todos to users with proper authorization
/// Includes validation to ensure user access rights and team membership constraints
/// </summary>
public class AssignTodoToUserCommandHandler : IRequestHandler<AssignTodoToUserCommand, bool>
{
    private readonly ITodoRepository _todoRepository;
    private readonly IUserRepository _userRepository;
    private readonly ITeamRepository _teamRepository;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="todoRepository">Repository for todo data operations</param>
    /// <param name="userRepository">Repository for user validation</param>
    /// <param name="teamRepository">Repository for team access validation</param>
    public AssignTodoToUserCommandHandler(
        ITodoRepository todoRepository, 
        IUserRepository userRepository, 
        ITeamRepository teamRepository)
    {
        _todoRepository = todoRepository;
        _userRepository = userRepository;
        _teamRepository = teamRepository;
    }

    /// <summary>
    /// Handles the process of assigning a todo to a user
    /// 1. Validates that todo, assignee, and requesting user exist
    /// 2. Checks authorization - only creators or team members can assign
    /// 3. Validates team membership if todo belongs to a team
    /// 4. Updates the todo assignment
    /// 5. Saves changes and returns success status
    /// </summary>
    /// <param name="request">The command containing todo ID, user ID, and requesting user ID</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Boolean indicating success of the operation</returns>
    /// <exception cref="ArgumentException">Thrown when todo, user, or requesting user doesn't exist</exception>
    /// <exception cref="UnauthorizedAccessException">Thrown when requesting user lacks permission</exception>
    /// <exception cref="InvalidOperationException">Thrown when business rules are violated</exception>
    public async Task<bool> Handle(AssignTodoToUserCommand request, CancellationToken cancellationToken)
    {
        // Step 1: Validate that the todo exists
        var todo = await _todoRepository.GetTaskByIdAsync(request.TodoId);
        if (todo == null)
        {
            throw new ArgumentException($"Todo with ID {request.TodoId} not found.");
        }

        // Step 2: Validate that the user to be assigned exists
        var assignee = await _userRepository.GetUserByIdAsync(request.UserId);
        if (assignee == null)
        {
            throw new ArgumentException($"User with ID {request.UserId} not found.");
        }

        // Step 3: Validate that the requesting user exists
        var requestingUser = await _userRepository.GetUserByIdAsync(request.RequestingUserId);
        if (requestingUser == null)
        {
            throw new ArgumentException($"Requesting user with ID {request.RequestingUserId} not found.");
        }

        // Step 4: Check authorization - only creators or team members can assign todos
        bool isAuthorized = false;

        // Check if requesting user is the creator of the todo
        if (todo.CreatedBy == request.RequestingUserId)
        {
            isAuthorized = true;
        }
        // Check if todo belongs to a team and requesting user has team access
        else if (todo.TeamID.HasValue)
        {
            var team = await _teamRepository.GetTeamByIdAsync(todo.TeamID.Value);
            if (team != null)
            {
                isAuthorized = team.Owner == request.RequestingUserId || 
                              team.Members.Any(m => m.Id == request.RequestingUserId);
            }
        }

        if (!isAuthorized)
        {
            throw new UnauthorizedAccessException($"User {request.RequestingUserId} does not have permission to assign this todo.");
        }

        // Step 5: If todo belongs to a team, verify the assignee has team access
        if (todo.TeamID.HasValue)
        {
            var team = await _teamRepository.GetTeamByIdAsync(todo.TeamID.Value);
            if (team != null)
            {
                var assigneeHasTeamAccess = team.Owner == request.UserId || 
                                          team.Members.Any(m => m.Id == request.UserId);
                if (!assigneeHasTeamAccess)
                {
                    throw new InvalidOperationException($"User {request.UserId} is not a member of the team associated with this todo.");
                }
            }
        }

        // Step 6: Update the todo assignment
        todo.AssignTo = request.UserId;
        todo.AssignedUser = assignee;

        // Step 7: Save the updated todo to persist the assignment
        var updatedTodo = await _todoRepository.UpdateTaskAsync(todo);

        // Step 8: Return success status
        return updatedTodo != null;
    }
}
