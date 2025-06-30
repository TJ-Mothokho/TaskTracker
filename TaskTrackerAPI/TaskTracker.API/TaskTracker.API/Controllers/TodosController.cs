using Microsoft.AspNetCore.Mvc;
using MediatR;
using TaskTracker.Application.DTOs.Todos;
using TaskTracker.Application.Features.Todos.Commands.CreateTodo;
using TaskTracker.Application.Features.Todos.Commands.UpdateTodo;
using TaskTracker.Application.Features.Todos.Commands.DeleteTodo;
using TaskTracker.Application.Features.Todos.Commands.AssignTodoToUser;
using TaskTracker.Application.Features.Todos.Commands.UnassignTodo;
using TaskTracker.Application.Features.Todos.Queries.GetTodoById;
using TaskTracker.Application.Features.Todos.Queries.GetTodosCreatedByUser;
using TaskTracker.Application.Features.Todos.Queries.GetTodosAssignedToUser;
using TaskTracker.Application.Features.Todos.Queries.GetTodosByTeam;

namespace TaskTracker.API.Controllers;

/// <summary>
/// API Controller for managing todos/tasks in the task tracker system
/// Provides RESTful endpoints for todo operations including:
/// - Creating, reading, updating, and deleting todos
/// - Managing todo assignments (assign/unassign users)
/// - Retrieving todos by different criteria (creator, assignee, team)
/// Follows REST conventions and uses MediatR for CQRS implementation
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Constructor injection of MediatR for command/query handling
    /// </summary>
    /// <param name="mediator">MediatR instance for processing commands and queries</param>
    public TodosController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Create a new todo/task with specified details
    /// POST /api/todos
    /// </summary>
    /// <param name="request">Todo creation data including title, description, priority, creator, assignee, team, and due date</param>
    /// <returns>Created todo information with assigned ID</returns>
    /// <response code="201">Todo successfully created</response>
    /// <response code="400">Invalid request data or validation errors</response>
    /// <response code="500">Internal server error</response>
    [HttpPost]
    public async Task<ActionResult<TodoResponseDto>> CreateTodo([FromBody] CreateTodoRequestDto request)
    {
        try
        {
            // Map the request DTO to command object
            // This separates the API contract from internal command structure
            var command = new CreateTodoCommand
            {
                Title = request.Title,
                Description = request.Description,
                Priority = request.Priority,
                CreatedBy = request.CreatedBy,
                AssignTo = request.AssignTo,
                TeamId = request.TeamId,
                DueDate = request.DueDate
            };

            // Send command through MediatR pipeline
            // This triggers the CreateTodoCommandHandler with full validation
            var result = await _mediator.Send(command);

            // Return 201 Created with the new todo data
            // Include location header pointing to the created resource
            return CreatedAtAction(nameof(GetTodoById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            // Handle validation errors (e.g., creator, assignee, or team not found)
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Handle business logic errors (e.g., invalid team access, assignment rules)
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while creating the todo", error = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve a specific todo/task by its unique identifier
    /// GET /api/todos/{id}
    /// </summary>
    /// <param name="id">Unique identifier of the todo to retrieve</param>
    /// <returns>Todo information including creator, assignee, and team details</returns>
    /// <response code="200">Todo found and returned</response>
    /// <response code="404">Todo not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TodoResponseDto>> GetTodoById(Guid id)
    {
        try
        {
            // Create query object with the todo ID
            var query = new GetTodoByIdQuery { TodoId = id };

            // Send query through MediatR pipeline
            var result = await _mediator.Send(query);

            // Return 200 OK with todo data
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            // Handle todo not found scenario
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while retrieving the todo", error = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve all todos created by a specific user
    /// GET /api/todos/created-by/{userId}
    /// Returns todos where the user is the creator/author
    /// </summary>
    /// <param name="userId">Unique identifier of the user</param>
    /// <returns>Collection of todos created by the user</returns>
    /// <response code="200">Todos found and returned (may be empty collection)</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("created-by/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetTodosCreatedByUser(Guid userId)
    {
        try
        {
            // Create query object with the user ID
            var query = new GetTodosCreatedByUserQuery { UserId = userId };

            // Send query through MediatR pipeline
            var result = await _mediator.Send(query);

            // Return 200 OK with todos collection (may be empty)
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            // Handle user not found scenario
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while retrieving created todos", error = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve all todos assigned to a specific user
    /// GET /api/todos/assigned-to/{userId}
    /// Returns todos where the user is the assignee (responsible for completion)
    /// </summary>
    /// <param name="userId">Unique identifier of the user</param>
    /// <returns>Collection of todos assigned to the user</returns>
    /// <response code="200">Todos found and returned (may be empty collection)</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("assigned-to/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetTodosAssignedToUser(Guid userId)
    {
        try
        {
            // Create query object with the user ID
            var query = new GetTodosAssignedToUserQuery { UserId = userId };

            // Send query through MediatR pipeline
            var result = await _mediator.Send(query);

            // Return 200 OK with todos collection (may be empty)
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            // Handle user not found scenario
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while retrieving assigned todos", error = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve all todos belonging to a specific team
    /// GET /api/todos/team/{teamId}/user/{userId}
    /// Returns todos associated with a team, with access control validation
    /// </summary>
    /// <param name="teamId">Unique identifier of the team</param>
    /// <param name="userId">Unique identifier of the user requesting the data (for access control)</param>
    /// <returns>Collection of todos belonging to the team</returns>
    /// <response code="200">Todos found and returned (may be empty collection)</response>
    /// <response code="401">User doesn't have access to team</response>
    /// <response code="404">Team or user not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("team/{teamId:guid}/user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<TodoResponseDto>>> GetTodosByTeam(Guid teamId, Guid userId)
    {
        try
        {
            // Create query object with both team ID and user ID for access control
            var query = new GetTodosByTeamQuery { TeamId = teamId, UserId = userId };

            // Send query through MediatR pipeline
            // Handler will validate user access to team before returning todos
            var result = await _mediator.Send(query);

            // Return 200 OK with todos collection (may be empty)
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            // Handle team or user not found scenario
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            // Handle access denied scenario
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while retrieving team todos", error = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing todo's information
    /// PUT /api/todos/{id}
    /// Supports partial updates - only provided fields will be updated
    /// </summary>
    /// <param name="id">Unique identifier of the todo to update</param>
    /// <param name="request">Updated todo information</param>
    /// <returns>Updated todo information</returns>
    /// <response code="200">Todo successfully updated</response>
    /// <response code="400">Invalid request data or validation errors</response>
    /// <response code="404">Todo not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TodoResponseDto>> UpdateTodo(Guid id, [FromBody] UpdateTodoRequestDto request)
    {
        try
        {
            // Ensure the ID in the URL matches the ID in the request body
            if (request.Id != id)
            {
                return BadRequest(new { message = "Todo ID in URL does not match ID in request body" });
            }

            // Map the request DTO to command object
            var command = new UpdateTodoCommand
            {
                Id = request.Id,
                Title = request.Title,
                Description = request.Description,
                Priority = request.Priority,
                AssignTo = request.AssignTo,
                TeamId = request.TeamId,
                DueDate = request.DueDate,
                Status = request.Status
            };

            // Send command through MediatR pipeline
            var result = await _mediator.Send(command);

            // Return 200 OK with updated todo data
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            // Handle todo not found or invalid references
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Handle business logic errors (e.g., invalid assignments, team access)
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while updating the todo", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete a todo from the system
    /// DELETE /api/todos/{id}
    /// This will remove the todo and clean up related assignments
    /// </summary>
    /// <param name="id">Unique identifier of the todo to delete</param>
    /// <returns>Success status of deletion operation</returns>
    /// <response code="204">Todo successfully deleted</response>
    /// <response code="404">Todo not found</response>
    /// <response code="500">Internal server error</response>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteTodo(Guid id)
    {
        try
        {
            // Create command object with todo ID
            var command = new DeleteTodoCommand { Id = id };

            // Send command through MediatR pipeline
            var result = await _mediator.Send(command);

            // Check if deletion was successful
            if (result)
            {
                // Return 204 No Content for successful deletion
                return NoContent();
            }
            else
            {
                // Return 500 if deletion failed for unknown reason
                return StatusCode(500, new { message = "Failed to delete the todo" });
            }
        }
        catch (ArgumentException ex)
        {
            // Handle todo not found scenario
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while deleting the todo", error = ex.Message });
        }
    }

    /// <summary>
    /// Assign a todo to a specific user
    /// POST /api/todos/{todoId}/assign/{userId}/by/{requestingUserId}
    /// </summary>
    /// <param name="todoId">Unique identifier of the todo to assign</param>
    /// <param name="userId">Unique identifier of the user to assign the todo to</param>
    /// <param name="requestingUserId">Unique identifier of the user making the assignment request</param>
    /// <returns>Success status of the assignment operation</returns>
    /// <response code="200">Todo successfully assigned</response>
    /// <response code="400">Invalid request or business logic error</response>
    /// <response code="401">Requesting user lacks permission</response>
    /// <response code="404">Todo or user not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("{todoId:guid}/assign/{userId:guid}/by/{requestingUserId:guid}")]
    public async Task<ActionResult> AssignTodoToUser(Guid todoId, Guid userId, Guid requestingUserId)
    {
        try
        {
            // Create command object with all required IDs
            var command = new AssignTodoToUserCommand
            {
                TodoId = todoId,
                UserId = userId,
                RequestingUserId = requestingUserId
            };

            // Send command through MediatR pipeline
            var result = await _mediator.Send(command);

            // Return success response
            if (result)
            {
                return Ok(new { message = "Todo successfully assigned to user" });
            }
            else
            {
                return StatusCode(500, new { message = "Failed to assign todo to user" });
            }
        }
        catch (ArgumentException ex)
        {
            // Handle todo or user not found
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            // Handle permission denied
            return Unauthorized(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Handle business logic errors (e.g., team membership issues)
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while assigning the todo", error = ex.Message });
        }
    }

    /// <summary>
    /// Unassign a todo from its current assignee
    /// DELETE /api/todos/{todoId}/unassign/by/{requestingUserId}
    /// </summary>
    /// <param name="todoId">Unique identifier of the todo to unassign</param>
    /// <param name="requestingUserId">Unique identifier of the user making the unassignment request</param>
    /// <returns>Success status of the unassignment operation</returns>
    /// <response code="200">Todo successfully unassigned</response>
    /// <response code="400">Invalid request or business logic error</response>
    /// <response code="401">Requesting user lacks permission</response>
    /// <response code="404">Todo not found</response>
    /// <response code="500">Internal server error</response>
    [HttpDelete("{todoId:guid}/unassign/by/{requestingUserId:guid}")]
    public async Task<ActionResult> UnassignTodo(Guid todoId, Guid requestingUserId)
    {
        try
        {
            // Create command object with required IDs
            var command = new UnassignTodoCommand
            {
                TodoId = todoId,
                RequestingUserId = requestingUserId
            };

            // Send command through MediatR pipeline
            var result = await _mediator.Send(command);

            // Return success response
            if (result)
            {
                return Ok(new { message = "Todo successfully unassigned" });
            }
            else
            {
                return StatusCode(500, new { message = "Failed to unassign todo" });
            }
        }
        catch (ArgumentException ex)
        {
            // Handle todo or user not found
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            // Handle permission denied
            return Unauthorized(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Handle business logic errors (e.g., todo not assigned)
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while unassigning the todo", error = ex.Message });
        }
    }
}
