using System;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Domain.Commons;

public abstract class BaseClass
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "Active";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

