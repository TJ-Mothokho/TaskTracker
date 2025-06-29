using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskTracker.Domain.Commons;

namespace TaskTracker.Domain.Entities;

public class Team : BaseClass
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [Required]
    public Guid Owner { get; set; }

    [ForeignKey("Owner")]
    public User User { get; set; }

    public ICollection<User> Members { get; set; } = new List<User>();
    public ICollection<Todo> Tasks { get; set; } = new List<Todo>();
}

