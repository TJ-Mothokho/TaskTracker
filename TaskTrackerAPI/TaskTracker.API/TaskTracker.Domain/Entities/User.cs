using System;
using System.ComponentModel.DataAnnotations;
using TaskTracker.Domain.Commons;

namespace TaskTracker.Domain.Entities;

public class User : BaseClass
{
    [Required]
    [StringLength(50)]
    public required string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public required string LastName { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string Password { get; set; }

    // JWT Refresh Token fields
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public ICollection<Team> Teams { get; set; } = new List<Team>();           // Member of
    public ICollection<Team> OwnedTeams { get; set; } = new List<Team>();      // Created/Owned
    public ICollection<Todo> Tasks { get; set; } = new List<Todo>();           // Assigned or created
}

