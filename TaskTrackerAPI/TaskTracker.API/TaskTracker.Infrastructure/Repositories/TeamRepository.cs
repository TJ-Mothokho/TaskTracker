using System;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Interfaces;
using TaskTracker.Infrastructure.Context;

namespace TaskTracker.Infrastructure.Repositories;

public class TeamRepository : ITeamRepository
{
    private readonly ApplicationDbContext _context;
    public TeamRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Team> AddTeamAsync(Team team)
    {
        await _context.Teams.AddAsync(team);
        await _context.SaveChangesAsync();

        var addedTeam = await _context.Teams.FirstOrDefaultAsync(t => t.Name == team.Name && t.CreatedAt == team.CreatedAt);

        if (addedTeam is null)
        {
            throw new NullReferenceException($"Error retreiving team. Adding team might have failed.");
        }

        return addedTeam;
    }

    public async Task<bool> DeleteTeamAsync(Team team)
    {
        _context.Teams.Update(team);
        await _context.SaveChangesAsync();

        var updatedTeam = await _context.Teams.FirstOrDefaultAsync(t => t.Id == team.Id && t.Status == "Inactive");

        if (updatedTeam is null)
        {
            throw new NullReferenceException($"Error retreiving team. Deleting team might have failed.");
        }

        return true;
    }

    public async Task<Team> GetTeamByIdAsync(Guid id)
    {
        var team = await _context.Teams.FirstOrDefaultAsync(t => t.Id == id);

        if (team is null)
        {
            throw new NullReferenceException("Team was not found");
        }

        return team;
    }

    public async Task<IEnumerable<Team>> GetTeamsAsync(Guid userID)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userID);

        var teams = await _context.Teams.Where(u => u.Owner == userID || u.User == user).ToListAsync();

        if (teams is null)
        {
            return Enumerable.Empty<Team>();
        }

        return teams;
    }

    public async Task<Team> UpdateTeamAsync(Team team)
    {
        _context.Teams.Update(team);
        await _context.SaveChangesAsync();

        var updatedTeam = await _context.Teams.FirstOrDefaultAsync(t => t.Id == team.Id);

        if (updatedTeam is null)
        {
            throw new NullReferenceException($"Error retreiving team. Updating team might have failed.");
        }

        return updatedTeam;
    }
}
