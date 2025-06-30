using System;
using MediatR;
using TaskTracker.Application.DTOs.Todos;

namespace TaskTracker.Application.Features.Todos.Commands.CreateTodo;

/// <summary>
/// Command to create a new todo/task in the system
/// This follows the CQRS pattern using MediatR for command handling
/// The command contains all necessary data to create a todo including creator, optional assignee, and team
/// </summary>
public record CreateTodoCommand : IRequest<TodoResponseDto>
{
    /// <summary>
    /// Title of the todo/task to be created
    /// This is a required field with maximum length of 150 characters
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Optional detailed description of the todo/task
    /// Provides additional context and requirements for the task
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Priority level of the todo/task (High, Medium, Low)
    /// Used for task prioritization and sorting
    /// </summary>
    public required Priority Priority { get; set; }

    /// <summary>
    /// ID of the user who is creating this todo/task
    /// This user will be recorded as the creator and typically has full permissions
    /// </summary>
    public required Guid CreatedBy { get; set; }

    /// <summary>
    /// Optional ID of the user to whom this task is assigned
    /// If null, the task remains unassigned and can be picked up later
    /// </summary>
    public Guid? AssignTo { get; set; }

    /// <summary>
    /// Optional ID of the team this task belongs to
    /// If specified, the task becomes part of team workflow and visibility
    /// </summary>
    public Guid? TeamId { get; set; }

    /// <summary>
    /// Due date for completing this todo/task
    /// Used for deadline tracking and task prioritization
    /// </summary>
    public required DateTime DueDate { get; set; }
}
