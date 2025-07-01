using System;
using MediatR;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Todos.Commands.UnassignTodo;

/// <summary>
/// Handler for UnassignTodoCommand that processes todo unassignment requests
/// Implements business logic for removing todo assignments with proper authorization
/// Includes validation to ensure user access rights and appropriate permissions
/// </summary>
public class UnassignTodoCommandHandler : IRequestHandler<UnassignTodoCommand, bool>
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
    public UnassignTodoCommandHandler(
        ITodoRepository todoRepository, 
        IUserRepository userRepository, 
        ITeamRepository teamRepository)
    {
        _todoRepository = todoRepository;
        _userRepository = userRepository;
        _teamRepository = teamRepository;
    }

    /// <summary>
    /// Handles the process of unassigning a todo from its current assignee
    /// 1. Validates that todo and requesting user exist
    /// 2. Checks that the todo is currently assigned
    /// 3. Validates authorization - creators, assignees, or team members can unassign
    /// 4. Removes the assignment from the todo
    /// 5. Saves changes and returns success status
    /// </summary>
    /// <param name="request">The command containing todo ID and requesting user ID</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Boolean indicating success of the operation</returns>
    /// <exception cref="ArgumentException">Thrown when todo or requesting user doesn't exist</exception>
    /// <exception cref="InvalidOperationException">Thrown when todo is not assigned</exception>
    /// <exception cref="UnauthorizedAccessException">Thrown when requesting user lacks permission</exception>
    public async Task<bool> Handle(UnassignTodoCommand request, CancellationToken cancellationToken)
    {
        // Step 1: Validate that the todo exists
        var todo = await _todoRepository.GetTaskByIdAsync(request.TodoId);
        if (todo == null)
        {
            throw new ArgumentException($"Todo with ID {request.TodoId} not found.");
        }

        // Step 2: Check that the todo is currently assigned
        if (!todo.AssignTo.HasValue)
        {
            throw new InvalidOperationException($"Todo {request.TodoId} is not currently assigned to anyone.");
        }

        // Step 3: Validate that the requesting user exists
        var requestingUser = await _userRepository.GetUserByIdAsync(request.RequestingUserId);
        if (requestingUser == null)
        {
            throw new ArgumentException($"Requesting user with ID {request.RequestingUserId} not found.");
        }

        // Step 4: Check authorization - multiple scenarios allow unassignment
        bool isAuthorized = false;

        // Scenario 1: Requesting user is the creator of the todo
        if (todo.CreatedBy == request.RequestingUserId)
        {
            isAuthorized = true;
        }
        // Scenario 2: Requesting user is the current assignee (self-unassignment)
        else if (todo.AssignTo == request.RequestingUserId)
        {
            isAuthorized = true;
        }
        // Scenario 3: Todo belongs to a team and requesting user has team access
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
            throw new UnauthorizedAccessException($"User {request.RequestingUserId} does not have permission to unassign this todo.");
        }

        // Step 5: Remove the assignment from the todo
        todo.AssignTo = null;
        todo.AssignedUser = null;

        // Step 6: Save the updated todo to persist the unassignment
        var updatedTodo = await _todoRepository.UpdateTaskAsync(todo);

        // Step 7: Return success status
        return updatedTodo != null;
    }
}
