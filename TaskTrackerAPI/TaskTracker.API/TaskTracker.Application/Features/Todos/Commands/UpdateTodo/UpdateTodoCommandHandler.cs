using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Todos;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Todos.Commands.UpdateTodo;

/// <summary>
/// Handler for UpdateTodoCommand that processes todo update requests
/// Implements business logic for updating todo properties with comprehensive validation
/// Uses selective updating - only modifies properties that are provided in the command
/// Handles complex validation scenarios for team and assignee relationships
/// </summary>
public class UpdateTodoCommandHandler : IRequestHandler<UpdateTodoCommand, TodoResponseDto>
{
    private readonly ITodoRepository _todoRepository;
    private readonly IUserRepository _userRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="todoRepository">Repository for todo data operations</param>
    /// <param name="userRepository">Repository for user validation</param>
    /// <param name="teamRepository">Repository for team validation</param>
    /// <param name="mapper">AutoMapper for entity to DTO conversion</param>
    public UpdateTodoCommandHandler(
        ITodoRepository todoRepository, 
        IUserRepository userRepository, 
        ITeamRepository teamRepository, 
        IMapper mapper)
    {
        _todoRepository = todoRepository;
        _userRepository = userRepository;
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the todo update process with selective property updates and validation
    /// 1. Retrieves the existing todo from database
    /// 2. Updates only the properties that are provided (non-null)
    /// 3. Validates new assignee and team relationships if they are being changed
    /// 4. Ensures business rules are maintained (team access, assignee permissions)
    /// 5. Saves the updated todo and returns the result
    /// </summary>
    /// <param name="request">The update todo command containing new values</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>TodoResponseDto containing the updated todo information</returns>
    /// <exception cref="ArgumentException">Thrown when todo, assignee, or team is not found</exception>
    /// <exception cref="InvalidOperationException">Thrown when business rules are violated</exception>
    public async Task<TodoResponseDto> Handle(UpdateTodoCommand request, CancellationToken cancellationToken)
    {
        // Step 1: Retrieve the existing todo from database
        // This ensures we're updating a todo that actually exists
        var existingTodo = await _todoRepository.GetTaskByIdAsync(request.Id);
        if (existingTodo == null)
        {
            throw new ArgumentException($"Todo with ID {request.Id} not found.");
        }

        // Step 2: Update basic properties if provided
        // Only modify properties that are explicitly provided in the request

        // Update title if provided
        if (!string.IsNullOrEmpty(request.Title))
        {
            existingTodo.Title = request.Title;
        }

        // Update description if provided (including setting to null/empty)
        if (request.Description != null)
        {
            existingTodo.Description = request.Description;
        }

        // Update priority if provided
        if (request.Priority.HasValue)
        {
            existingTodo.Priority = (TaskTracker.Domain.Enums.Priority)request.Priority.Value;
        }

        // Update due date if provided
        if (request.DueDate.HasValue)
        {
            existingTodo.DueDate = request.DueDate.Value;
        }

        // Update status if provided
        if (!string.IsNullOrEmpty(request.Status))
        {
            existingTodo.Status = request.Status;
        }

        // Step 3: Handle team update if specified
        // Team changes require validation and may affect assignee validation
        Team? newTeam = null;
        if (request.TeamId.HasValue)
        {
            if (request.TeamId.Value != Guid.Empty)
            {
                // Validate that the new team exists
                newTeam = await _teamRepository.GetTeamByIdAsync(request.TeamId.Value);
                if (newTeam == null)
                {
                    throw new ArgumentException($"Team with ID {request.TeamId} not found.");
                }

                // Verify that the todo creator has access to the new team
                var creatorHasTeamAccess = newTeam.Owner == existingTodo.CreatedBy || 
                                         newTeam.Members.Any(m => m.Id == existingTodo.CreatedBy);
                if (!creatorHasTeamAccess)
                {
                    throw new InvalidOperationException($"Todo creator does not have access to team {request.TeamId}.");
                }

                // Update the team assignment
                existingTodo.TeamID = request.TeamId.Value;
                existingTodo.TaskTeam = newTeam;
            }
            else
            {
                // TeamId is Guid.Empty, which means remove team assignment
                existingTodo.TeamID = null;
                existingTodo.TaskTeam = null;
            }
        }

        // Step 4: Handle assignee update if specified
        // Assignee changes require validation against team membership if applicable
        if (request.AssignTo.HasValue)
        {
            if (request.AssignTo.Value != Guid.Empty)
            {
                // Validate that the new assignee exists
                var newAssignee = await _userRepository.GetUserByIdAsync(request.AssignTo.Value);
                if (newAssignee == null)
                {
                    throw new ArgumentException($"Assignee with ID {request.AssignTo} not found.");
                }

                // If todo is assigned to a team, verify assignee has team access
                var teamToCheck = newTeam ?? existingTodo.TaskTeam; // Use new team if being updated, otherwise existing team
                if (teamToCheck != null)
                {
                    var assigneeHasTeamAccess = teamToCheck.Owner == request.AssignTo.Value || 
                                              teamToCheck.Members.Any(m => m.Id == request.AssignTo.Value);
                    if (!assigneeHasTeamAccess)
                    {
                        throw new InvalidOperationException($"Assignee {request.AssignTo} is not a member of the associated team.");
                    }
                }

                // Update the assignee
                existingTodo.AssignTo = request.AssignTo.Value;
                existingTodo.AssignedUser = newAssignee;
            }
            else
            {
                // AssignTo is Guid.Empty, which means unassign the todo
                existingTodo.AssignTo = null;
                existingTodo.AssignedUser = null;
            }
        }

        // Step 5: Save the updated todo to the database
        // The repository handles the persistence and any related updates
        var updatedTodo = await _todoRepository.UpdateTaskAsync(existingTodo);

        // Step 6: Convert the updated todo entity to response DTO
        // AutoMapper handles the conversion including nested objects
        return _mapper.Map<TodoResponseDto>(updatedTodo);
    }
}
