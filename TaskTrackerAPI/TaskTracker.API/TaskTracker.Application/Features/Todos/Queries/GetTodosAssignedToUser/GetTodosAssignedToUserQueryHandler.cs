using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Todos;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Todos.Queries.GetTodosAssignedToUser;

/// <summary>
/// Handler for GetTodosAssignedToUserQuery that retrieves todos assigned to a specific user
/// Implements query processing logic for fetching user's assigned todos
/// Returns todos where the user is the assignee, useful for "My Tasks" or "Assigned to Me" views
/// </summary>
public class GetTodosAssignedToUserQueryHandler : IRequestHandler<GetTodosAssignedToUserQuery, IEnumerable<TodoResponseDto>>
{
    private readonly ITodoRepository _todoRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="todoRepository">Repository for todo data retrieval operations</param>
    /// <param name="userRepository">Repository for user validation</param>
    /// <param name="mapper">AutoMapper for entity to DTO conversion</param>
    public GetTodosAssignedToUserQueryHandler(ITodoRepository todoRepository, IUserRepository userRepository, IMapper mapper)
    {
        _todoRepository = todoRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the user's assigned todos retrieval process
    /// 1. Validates that the user exists in the system
    /// 2. Retrieves all todos assigned to the user
    /// 3. Maps todo entities to response DTOs
    /// 4. Returns the complete list of assigned todos
    /// </summary>
    /// <param name="request">The query containing the user ID</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Collection of TodoResponseDto containing all todos assigned to the user</returns>
    /// <exception cref="ArgumentException">Thrown when user with specified ID is not found</exception>
    public async Task<IEnumerable<TodoResponseDto>> Handle(GetTodosAssignedToUserQuery request, CancellationToken cancellationToken)
    {
        // Step 1: Validate that the user exists
        // This ensures we don't perform unnecessary database operations for invalid users
        var user = await _userRepository.GetUserByIdAsync(request.UserId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {request.UserId} not found.");
        }

        // Step 2: Retrieve all todos assigned to the user
        // The repository method should return todos where AssignTo = UserId
        // This includes todos created by others but assigned to this user
        var assignedTodos = await _todoRepository.GetTasksAssignedAsync(request.UserId);

        // Step 3: Map todo entities to response DTOs
        // AutoMapper handles the conversion for each todo including:
        // - Todo basic information (ID, Title, Description, Priority, DueDate, Status)
        // - Creator details (who created the todo)
        // - Assignee details (the requesting user)
        // - Team information (if todo belongs to a team)
        var todoDtos = _mapper.Map<IEnumerable<TodoResponseDto>>(assignedTodos);

        // Step 4: Return the mapped todo collection
        // Returns empty collection if user has no assigned todos
        return todoDtos;
    }
}
