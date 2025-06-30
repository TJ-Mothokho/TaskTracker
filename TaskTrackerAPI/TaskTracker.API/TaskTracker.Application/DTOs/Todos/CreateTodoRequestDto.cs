using System;
using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Application.DTOs.Todos;

public class CreateTodoRequestDto
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

    public Guid? TeamId { get; set; }

    [Required]
    public DateTime DueDate { get; set; }
}

