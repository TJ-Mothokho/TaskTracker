using System;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Domain.Interfaces;

public interface ITeamRepository
{
    Task<IEnumerable<Team>> GetTeamsAsync(Guid userID);
    Task<Team> GetTeamByIdAsync(Guid id);
    Task<Team> AddTeamAsync(Team team);
    Task<Team> UpdateTeamAsync(Team team);
    Task<bool> DeleteTeamAsync(Team team);

}
