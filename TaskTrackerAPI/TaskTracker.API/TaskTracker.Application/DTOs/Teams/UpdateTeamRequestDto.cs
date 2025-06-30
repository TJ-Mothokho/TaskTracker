using System;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Application.DTOs.Teams;

public class UpdateTeamRequestDto
{
    [Required]
    public Guid Id { get; set; }

    [StringLength(100)]
    public string? Name { get; set; }

    public Guid? OwnerId { get; set; }

    public List<Guid>? MemberIds { get; set; }
}

