using System;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Application.DTOs.Todos;

public class UpdateTodoRequestDto
{
    [Required]
    public Guid Id { get; set; }

    [StringLength(150)]
    public string? Title { get; set; }

    public string? Description { get; set; }

    public Priority? Priority { get; set; }

    public Guid? AssignTo { get; set; }

    public Guid? TeamId { get; set; }

    public DateTime? DueDate { get; set; }

    public string? Status { get; set; }
}

