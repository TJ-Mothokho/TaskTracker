using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Todos;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Todos.Commands.CreateTodo;

/// <summary>
/// Handler for CreateTodoCommand that processes todo creation requests
/// Implements the business logic for creating new todos with proper validation
/// Handles creator, assignee, and team relationship establishment
/// Follows the Command Handler pattern with MediatR
/// </summary>
public class CreateTodoCommandHandler : IRequestHandler<CreateTodoCommand, TodoResponseDto>
{
    private readonly ITodoRepository _todoRepository;
    private readonly IUserRepository _userRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="todoRepository">Repository for todo data operations</param>
    /// <param name="userRepository">Repository for user validation (creator and assignee)</param>
    /// <param name="teamRepository">Repository for team validation when todo is assigned to team</param>
    /// <param name="mapper">AutoMapper for entity to DTO conversion</param>
    public CreateTodoCommandHandler(
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
    /// Handles the todo creation process with comprehensive validation
    /// 1. Validates that the creator exists
    /// 2. Validates assignee if specified
    /// 3. Validates team if specified and ensures creator/assignee has access
    /// 4. Creates the todo entity with proper relationships
    /// 5. Saves to database and returns the created todo data
    /// </summary>
    /// <param name="request">The create todo command containing todo details</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>TodoResponseDto containing the created todo information</returns>
    /// <exception cref="ArgumentException">Thrown when creator, assignee, or team doesn't exist</exception>
    /// <exception cref="InvalidOperationException">Thrown when business rules are violated</exception>
    public async Task<TodoResponseDto> Handle(CreateTodoCommand request, CancellationToken cancellationToken)
    {
        // Step 1: Validate that the creator exists in the system
        // This ensures we don't create orphaned todos
        var creator = await _userRepository.GetUserByIdAsync(request.CreatedBy);
        if (creator == null)
        {
            throw new ArgumentException($"Creator with ID {request.CreatedBy} not found.");
        }

        // Step 2: Validate assignee if one is specified
        // Assignee validation ensures the task can be properly assigned
        User? assignee = null;
        if (request.AssignTo.HasValue)
        {
            assignee = await _userRepository.GetUserByIdAsync(request.AssignTo.Value);
            if (assignee == null)
            {
                throw new ArgumentException($"Assignee with ID {request.AssignTo} not found.");
            }
        }

        // Step 3: Validate team if one is specified
        // Team validation ensures proper team workflow integration
        Team? team = null;
        if (request.TeamId.HasValue)
        {
            team = await _teamRepository.GetTeamByIdAsync(request.TeamId.Value);
            if (team == null)
            {
                throw new ArgumentException($"Team with ID {request.TeamId} not found.");
            }

            // Step 3.1: Verify creator has access to the specified team
            // Creator must be either owner or member of the team
            var creatorHasTeamAccess = team.Owner == request.CreatedBy || 
                                     team.Members.Any(m => m.Id == request.CreatedBy);
            if (!creatorHasTeamAccess)
            {
                throw new InvalidOperationException($"Creator {request.CreatedBy} does not have access to team {request.TeamId}.");
            }

            // Step 3.2: If assignee is specified and team is specified, verify assignee has team access
            // This prevents assigning tasks to users outside the team context
            if (request.AssignTo.HasValue)
            {
                var assigneeHasTeamAccess = team.Owner == request.AssignTo.Value || 
                                          team.Members.Any(m => m.Id == request.AssignTo.Value);
                if (!assigneeHasTeamAccess)
                {
                    throw new InvalidOperationException($"Assignee {request.AssignTo} is not a member of team {request.TeamId}.");
                }
            }
        }

        // Step 4: Create the todo entity from the command data
        // Map all the validated relationships and properties
        var todo = new Todo
        {
            Id = Guid.NewGuid(), // Generate new unique identifier
            Title = request.Title,
            Description = request.Description,
            Priority = (TaskTracker.Domain.Enums.Priority)request.Priority, // Convert DTO enum to Domain enum
            CreatedBy = request.CreatedBy,
            AssignTo = request.AssignTo,
            TeamID = request.TeamId,
            DueDate = request.DueDate,
            CreatorUser = creator, // Set the creator relationship
            AssignedUser = assignee, // Set the assignee relationship (can be null)
            TaskTeam = team, // Set the team relationship (can be null)
            Status = "Active", // Set default status from BaseClass
            CreatedAt = DateTime.UtcNow // Set creation timestamp
        };

        // Step 5: Save the new todo to the database
        // The repository handles the actual persistence logic including relationships
        var createdTodo = await _todoRepository.AddTaskAsync(todo);

        // Step 6: Convert the created todo entity to response DTO
        // AutoMapper handles the mapping including nested objects (Creator, Assignee, Team)
        return _mapper.Map<TodoResponseDto>(createdTodo);
    }
}
