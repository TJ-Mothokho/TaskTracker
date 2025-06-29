using System;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Domain.Entities;

namespace TaskTracker.Infrastructure.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
 
    public DbSet<User> Users { get; set; }
    public DbSet<Todo> Todos { get; set; }
    public DbSet<Team> Teams { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(u => u.LastName).IsRequired().HasMaxLength(50);
            entity.Property(u => u.Password).IsRequired();
        });

        // Configure Team entity
        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Name).IsRequired().HasMaxLength(100);
            
            // One-to-many: User -> OwnedTeams
            entity.HasOne(t => t.User)
                  .WithMany(u => u.OwnedTeams)
                  .HasForeignKey(t => t.Owner)
                  .OnDelete(DeleteBehavior.Restrict);

            // Many-to-many: User <-> Team (Members)
            entity.HasMany(t => t.Members)
                  .WithMany(u => u.Teams)
                  .UsingEntity(j => j.ToTable("TeamMembers"));
        });

        // Configure Todo entity
        modelBuilder.Entity<Todo>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Title).IsRequired().HasMaxLength(150);
            entity.Property(t => t.Description).HasMaxLength(1000);
            entity.Property(t => t.Priority).IsRequired();
            entity.Property(t => t.DueDate).IsRequired();

            // One-to-many: User -> Created Tasks
            entity.HasOne(t => t.CreatorUser)
                  .WithMany(u => u.Tasks)
                  .HasForeignKey(t => t.CreatedBy)
                  .OnDelete(DeleteBehavior.Restrict);

            // One-to-many: User -> Assigned Tasks (optional)
            entity.HasOne(t => t.AssignedUser)
                  .WithMany()
                  .HasForeignKey(t => t.AssignTo)
                  .OnDelete(DeleteBehavior.SetNull);

            // One-to-many: Team -> Tasks (optional)
            entity.HasOne(t => t.TaskTeam)
                  .WithMany(team => team.Tasks)
                  .HasForeignKey(t => t.TeamID)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
