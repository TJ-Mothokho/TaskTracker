using Microsoft.EntityFrameworkCore;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Interfaces;
using TaskTracker.Infrastructure.Context;

namespace TaskTracker.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;
    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> AddUserAsync(User user)
    {
        await _context.AddAsync(user);
        await _context.SaveChangesAsync();

        var addedUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

        if (addedUser is null)
        {
            throw new NullReferenceException($"Error retreiving user {user.Email}. Adding using might have failed.");
        }

        return addedUser;
    }

    public async Task<bool> DeleteUserAsync(User user)
    {
        _context.Update(user);
        await _context.SaveChangesAsync();

        var updatedUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id && u.Status == "Inactive");

        if (updatedUser is null)
        {
            throw new NullReferenceException($"Error retreiving user {user.Email}. Updating using might have failed.");
        }

        return true;
    }

    public async Task<IEnumerable<User>> GetTeamMembersAsync(Guid teamID)
    {
        var team = await _context.Teams
        .Include(t => t.Members)
        .FirstOrDefaultAsync(t => t.Id == teamID);

        return team?.Members ?? Enumerable.Empty<User>();
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
        {
            throw new NullReferenceException($"Error retreiving user {email}.");
        }

        return user;
    }

    public async Task<User> GetUserByIdAsync(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        if (user is null)
        {
            throw new NullReferenceException($"Error retreiving user {id}.");
        }

        return user;
    }

    public async Task<User> LoginAsync(string email, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Password == password);

        if (user is null)
        {
            throw new NullReferenceException($"Error retreiving user {email}.");
        }

        return user;
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        _context.Update(user);
        await _context.SaveChangesAsync();

        var updatedUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id);

        if (updatedUser is null)
        {
            throw new NullReferenceException($"Error retreiving user {user.Email}. Updating using might have failed.");
        }

        return updatedUser;
    }
}
