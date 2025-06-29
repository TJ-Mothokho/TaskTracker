using System;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Domain.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetTeamMembersAsync(Guid teamID); //Get Team Members by Team ID
    Task<User> LoginAsync(string email, string password);
    Task<User> GetUserByIdAsync(Guid id);
    Task<User> GetUserByEmailAsync(string email);
    Task<User> AddUserAsync(User user);
    Task<User> UpdateUserAsync(User user);
    Task<bool> DeleteUserAsync(User user); //Soft Delete
}
