using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskTracker.Domain.Commons;
using TaskTracker.Domain.Enums;

namespace TaskTracker.Domain.Entities;

public class Todo : BaseClass
{
    [Required]
    [StringLength(150)]
    public string Title { get; set; }

    public string? Description { get; set; }

    [Required]
    public Priority Priority { get; set; }

    [Required]
    public Guid CreatedBy { get; set; }

    public Guid? AssignTo { get; set; }
    public Guid? TeamID { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    [ForeignKey("CreatedBy")]
    public User CreatorUser { get; set; }

    [ForeignKey("AssignTo")]
    public User? AssignedUser { get; set; }

    [ForeignKey("Team")]
    public Team? TaskTeam { get; set; }
}

