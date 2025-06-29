using System;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Application.DTOs.Users;

public class UpdateUserRequestDto
{
    [Required]
    public Guid Id { get; set; }

    [StringLength(50)]
    public string? FirstName { get; set; }

    [StringLength(50)]
    public string? LastName { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    public string? Password { get; set; }
}

