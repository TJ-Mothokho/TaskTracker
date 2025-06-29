using System;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Interfaces;
using TaskTracker.Infrastructure.Context;

namespace TaskTracker.Infrastructure.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly ApplicationDbContext _context;
    public TodoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Todo> AddTaskAsync(Todo todo)
    {
        await _context.AddAsync(todo);
        await _context.SaveChangesAsync();

        var addedTask = await _context.Todos.FirstOrDefaultAsync(t => t.Title == todo.Title && t.CreatedAt == todo.CreatedAt);

        if (addedTask is null)
        {
            throw new NullReferenceException($"Error retreiving todo. Adding todo might have failed.");
        }

        return addedTask;
    }

    //Soft Delete
    public async Task<Todo> DeleteTaskAsync(Todo todo)
    {
        _context.Update(todo);
        await _context.SaveChangesAsync();

        var updatedTask = await _context.Todos.FirstOrDefaultAsync(t => t.Id == todo.Id && t.Status == "Inactive");

        if (updatedTask is null)
        {
            throw new NullReferenceException($"Error retreiving todo. Deleting todo might have failed.");
        }

        return updatedTask;
    }

    public async Task<Todo> GetTaskByIdAsync(Guid id)
    {
        var task = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id);

        if (task is null)
        {
            throw new NullReferenceException($"Error retieving task {id}.");
        }

        return task;
    }

    public async Task<IEnumerable<Todo>> GetTasksCreatedAsync(Guid userID)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userID);

        var tasks = await _context.Todos.Where(t => t.CreatorUser == user).ToListAsync();

        if (tasks is null)
        {
            return Enumerable.Empty<Todo>();
        }

        return tasks;
    }

    public async Task<IEnumerable<Todo>> GetTasksAssignedAsync(Guid userID)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userID);

        var tasks = await _context.Todos.Where(t => t.AssignedUser == user).ToListAsync();

        if (tasks is null)
        {
            return Enumerable.Empty<Todo>();
        }

        return tasks;
    }

    public async Task<IEnumerable<Todo>> GetTasksByTeamAsync(Guid userID, Guid teamID)
    {
        var tasks = await _context.Todos.Where(t => t.AssignTo == userID && t.TeamID == teamID).ToListAsync();

        if (tasks is null)
        {
            return Enumerable.Empty<Todo>();
        }

        return tasks;
    }

    public async Task<Todo> UpdateTaskAsync(Todo todo)
    {
        _context.Update(todo);
        await _context.SaveChangesAsync();

        var updatedTask = await _context.Todos.FirstOrDefaultAsync(t => t.Title == todo.Title && t.CreatedAt == todo.CreatedAt);

        if (updatedTask is null)
        {
            throw new NullReferenceException($"Error retreiving todo. Updating todo might have failed.");
        }

        return updatedTask;
    }
}
