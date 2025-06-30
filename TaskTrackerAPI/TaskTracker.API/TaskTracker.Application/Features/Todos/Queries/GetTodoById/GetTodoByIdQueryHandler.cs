using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Todos;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Todos.Queries.GetTodoById;

/// <summary>
/// Handler for GetTodoByIdQuery that retrieves a specific todo's details
/// Implements query processing logic for fetching todo information by ID
/// Returns complete todo data including related entities (creator, assignee, team)
/// </summary>
public class GetTodoByIdQueryHandler : IRequestHandler<GetTodoByIdQuery, TodoResponseDto>
{
    private readonly ITodoRepository _todoRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="todoRepository">Repository for todo data retrieval operations</param>
    /// <param name="mapper">AutoMapper for entity to DTO conversion</param>
    public GetTodoByIdQueryHandler(ITodoRepository todoRepository, IMapper mapper)
    {
        _todoRepository = todoRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Handles the todo retrieval process
    /// 1. Fetches the todo from the database using the provided ID
    /// 2. Validates that the todo exists
    /// 3. Maps the todo entity to a response DTO
    /// 4. Returns the complete todo information
    /// </summary>
    /// <param name="request">The query containing the todo ID to retrieve</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>TodoResponseDto containing the todo details, creator, assignee, and team info</returns>
    /// <exception cref="ArgumentException">Thrown when todo with specified ID is not found</exception>
    public async Task<TodoResponseDto> Handle(GetTodoByIdQuery request, CancellationToken cancellationToken)
    {
        // Step 1: Retrieve the todo from the database
        // The repository should include related entities (Creator, Assignee, Team) for complete data
        var todo = await _todoRepository.GetTaskByIdAsync(request.TodoId);
        
        // Step 2: Validate that the todo exists
        // Provide clear error message if todo is not found
        if (todo == null)
        {
            throw new ArgumentException($"Todo with ID {request.TodoId} not found.");
        }

        // Step 3: Map the todo entity to response DTO
        // AutoMapper handles the conversion including nested objects:
        // - Todo basic info (ID, Title, Description, Priority, DueDate, Status)
        // - Creator information (mapped to UserResponseDto)
        // - Assignee information (mapped to UserResponseDto, can be null)
        // - Team information (mapped to TeamResponseDto, can be null)
        return _mapper.Map<TodoResponseDto>(todo);
    }
}
