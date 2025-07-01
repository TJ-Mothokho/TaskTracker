using System;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Application.DTOs.Teams;

public class AddMembersByEmailRequestDto
{
    [Required]
    public required List<string> Emails { get; set; }
}
