using System;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Domain.Interfaces;

public interface ITodoRepository
{
    Task<IEnumerable<Todo>> GetTasksCreatedAsync(Guid userID);
    Task<IEnumerable<Todo>> GetTasksAssignedAsync(Guid userID);
    Task<IEnumerable<Todo>> GetTasksByTeamAsync(Guid userID, Guid teamID);
    Task<Todo> GetTaskByIdAsync(Guid id);
    Task<Todo> AddTaskAsync(Todo todo);
    Task<Todo> UpdateTaskAsync(Todo todo);
    Task<Todo> DeleteTaskAsync(Todo todo);
}
