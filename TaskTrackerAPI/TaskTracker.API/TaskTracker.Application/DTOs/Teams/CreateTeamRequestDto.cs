using System;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Application.DTOs.Teams;

public class CreateTeamRequestDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [Required]
    public Guid OwnerId { get; set; }

    public List<Guid>? MemberIds { get; set; }
}

