using System;
using MediatR;
using TaskTracker.Application.DTOs.Todos;

namespace TaskTracker.Application.Features.Todos.Commands.UpdateTodo;

/// <summary>
/// Command to update an existing todo/task's information
/// Follows CQRS pattern using MediatR for command processing
/// Allows updating title, description, priority, assignee, team, due date, and status
/// Uses selective updating - only provided properties will be modified
/// </summary>
public record UpdateTodoCommand : IRequest<TodoResponseDto>
{
    /// <summary>
    /// Unique identifier of the todo/task to be updated
    /// This is required to locate the specific todo in the database
    /// </summary>
    public required Guid Id { get; set; }

    /// <summary>
    /// New title for the todo (optional)
    /// If null, the todo title will remain unchanged
    /// Maximum length of 150 characters when provided
    /// </summary>
    public string? Title { get; set; }

    /// <summary>
    /// New description for the todo (optional)
    /// If null, the todo description will remain unchanged
    /// Can be set to empty string to clear existing description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// New priority level for the todo (optional)
    /// If null, the todo priority will remain unchanged
    /// Must be one of: High, Medium, Low
    /// </summary>
    public Priority? Priority { get; set; }

    /// <summary>
    /// New assignee ID for the todo (optional)
    /// If null, the todo assignment will remain unchanged
    /// If provided, the user must exist and have access to the team (if todo is team-based)
    /// Can be set to Guid.Empty to unassign the todo
    /// </summary>
    public Guid? AssignTo { get; set; }

    /// <summary>
    /// New team ID for the todo (optional)
    /// If null, the todo team assignment will remain unchanged
    /// If provided, the team must exist and the creator must have access
    /// Changing team may affect assignee validation
    /// </summary>
    public Guid? TeamId { get; set; }

    /// <summary>
    /// New due date for the todo (optional)
    /// If null, the todo due date will remain unchanged
    /// Used for deadline tracking and prioritization
    /// </summary>
    public DateTime? DueDate { get; set; }

    /// <summary>
    /// New status for the todo (optional)
    /// If null, the todo status will remain unchanged
    /// Common values: "Active", "Completed", "On Hold", "Cancelled"
    /// </summary>
    public string? Status { get; set; }
}
