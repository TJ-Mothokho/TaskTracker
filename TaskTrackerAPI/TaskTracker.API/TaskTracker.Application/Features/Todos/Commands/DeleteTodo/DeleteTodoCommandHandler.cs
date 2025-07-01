using System;
using MediatR;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Todos.Commands.DeleteTodo;

/// <summary>
/// Handler for DeleteTodoCommand that processes todo deletion requests
/// Implements business logic for safely removing todos from the system
/// Handles validation and cleanup of related data
/// </summary>
public class DeleteTodoCommandHandler : IRequestHandler<DeleteTodoCommand, bool>
{
    private readonly ITodoRepository _todoRepository;

    /// <summary>
    /// Constructor injection of required dependencies
    /// </summary>
    /// <param name="todoRepository">Repository for todo data operations</param>
    public DeleteTodoCommandHandler(ITodoRepository todoRepository)
    {
        _todoRepository = todoRepository;
    }

    /// <summary>
    /// Handles the todo deletion process
    /// 1. Retrieves the todo to ensure it exists
    /// 2. Performs the deletion operation
    /// 3. Returns success/failure status
    /// 
    /// Note: The actual cleanup logic (handling of related data, audit trails)
    /// should be implemented at the repository/database level through proper
    /// cascading rules or explicit cleanup operations
    /// </summary>
    /// <param name="request">The delete todo command containing todo ID</param>
    /// <param name="cancellationToken">Cancellation token for async operation</param>
    /// <returns>Boolean indicating whether the deletion was successful</returns>
    /// <exception cref="ArgumentException">Thrown when todo is not found</exception>
    public async Task<bool> Handle(DeleteTodoCommand request, CancellationToken cancellationToken)
    {
        // Step 1: Retrieve the todo to ensure it exists before attempting deletion
        // This provides better error handling and prevents unnecessary database operations
        var todoToDelete = await _todoRepository.GetTaskByIdAsync(request.Id);
        if (todoToDelete == null)
        {
            throw new ArgumentException($"Todo with ID {request.Id} not found.");
        }

        // Step 2: Perform the deletion operation
        // The repository should handle:
        // - Removing assignee relationships
        // - Removing team relationships  
        // - Proper cleanup of foreign key relationships
        // - Optionally: Creating audit trail for deleted todo
        // - Optionally: Soft delete vs hard delete logic
        var deleteResult = await _todoRepository.DeleteTaskAsync(todoToDelete);

        // Step 3: Return the result of the deletion operation
        // True indicates successful deletion, false indicates failure
        return deleteResult != null; // Assuming repository returns the deleted entity or null
    }
}
