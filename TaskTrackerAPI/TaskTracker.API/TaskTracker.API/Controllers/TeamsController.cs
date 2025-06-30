using Microsoft.AspNetCore.Mvc;
using MediatR;
using TaskTracker.Application.DTOs.Teams;
using TaskTracker.Application.Features.Teams.Commands.CreateTeam;
using TaskTracker.Application.Features.Teams.Commands.UpdateTeam;
using TaskTracker.Application.Features.Teams.Commands.DeleteTeam;
using TaskTracker.Application.Features.Teams.Commands.AddMemberToTeam;
using TaskTracker.Application.Features.Teams.Commands.RemoveMemberFromTeam;
using TaskTracker.Application.Features.Teams.Queries.GetTeamById;
using TaskTracker.Application.Features.Teams.Queries.GetUserTeams;

namespace TaskTracker.API.Controllers;

/// <summary>
/// API Controller for managing teams in the task tracker system
/// Provides RESTful endpoints for team operations including:
/// - Creating, reading, updating, and deleting teams
/// - Managing team membership (adding/removing members)
/// - Retrieving user's team associations
/// Follows REST conventions and uses MediatR for CQRS implementation
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Constructor injection of MediatR for command/query handling
    /// </summary>
    /// <param name="mediator">MediatR instance for processing commands and queries</param>
    public TeamsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Test endpoint to verify the controller is working
    /// </summary>
    [HttpGet("test")]
    public ActionResult<string> Test()
    {
        return Ok("TeamsController is working!");
    }

    /// <summary>
    /// Create a new team with specified owner and optional members
    /// POST /api/teams
    /// </summary>
    /// <param name="request">Team creation data including name, owner, and member list</param>
    /// <returns>Created team information with assigned ID</returns>
    /// <response code="201">Team successfully created</response>
    /// <response code="400">Invalid request data or validation errors</response>
    /// <response code="500">Internal server error</response>
    [HttpPost]
    public async Task<ActionResult<TeamResponseDto>> CreateTeam([FromBody] CreateTeamRequestDto request)
    {
        try
        {
            // Map the request DTO to command object
            // This separates the API contract from internal command structure
            var command = new CreateTeamCommand
            {
                Name = request.Name,
                OwnerId = request.OwnerId,
                MemberIds = request.MemberIds
            };

            // Send command through MediatR pipeline
            // This triggers the CreateTeamCommandHandler
            var result = await _mediator.Send(command);

            // Return 201 Created with the new team data
            // Include location header pointing to the created resource
            return CreatedAtAction(nameof(GetTeamById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            // Handle validation errors (e.g., owner not found)
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Handle business logic errors (e.g., invalid members)
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while creating the team", error = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve a specific team by its unique identifier
    /// GET /api/teams/{id}
    /// </summary>
    /// <param name="id">Unique identifier of the team to retrieve</param>
    /// <returns>Team information including owner and members</returns>
    /// <response code="200">Team found and returned</response>
    /// <response code="404">Team not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TeamResponseDto>> GetTeamById(Guid id)
    {
        try
        {
            // Create query object with the team ID
            var query = new GetTeamByIdQuery { TeamId = id };

            // Send query through MediatR pipeline
            var result = await _mediator.Send(query);

            // Return 200 OK with team data
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            // Handle team not found scenario
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while retrieving the team", error = ex.Message });
        }
    }

    /// <summary>
    /// Retrieve all teams associated with a specific user
    /// GET /api/teams/user/{userId}
    /// Returns teams where user is owner or member
    /// </summary>
    /// <param name="userId">Unique identifier of the user</param>
    /// <returns>Collection of teams associated with the user</returns>
    /// <response code="200">Teams found and returned (may be empty collection)</response>
    /// <response code="404">User not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<TeamResponseDto>>> GetUserTeams(Guid userId)
    {
        try
        {
            // Create query object with the user ID
            var query = new GetUserTeamsQuery { UserId = userId };

            // Send query through MediatR pipeline
            var result = await _mediator.Send(query);

            // Return 200 OK with teams collection (may be empty)
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
            return StatusCode(500, new { message = "An error occurred while retrieving user teams", error = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing team's information
    /// PUT /api/teams/{id}
    /// Supports partial updates - only provided fields will be updated
    /// </summary>
    /// <param name="id">Unique identifier of the team to update</param>
    /// <param name="request">Updated team information</param>
    /// <returns>Updated team information</returns>
    /// <response code="200">Team successfully updated</response>
    /// <response code="400">Invalid request data or validation errors</response>
    /// <response code="404">Team not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TeamResponseDto>> UpdateTeam(Guid id, [FromBody] UpdateTeamRequestDto request)
    {
        try
        {
            // Ensure the ID in the URL matches the ID in the request body
            if (request.Id != id)
            {
                return BadRequest(new { message = "Team ID in URL does not match ID in request body" });
            }

            // Map the request DTO to command object
            var command = new UpdateTeamCommand
            {
                Id = request.Id,
                Name = request.Name,
                OwnerId = request.OwnerId,
                MemberIds = request.MemberIds
            };

            // Send command through MediatR pipeline
            var result = await _mediator.Send(command);

            // Return 200 OK with updated team data
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            // Handle team not found scenario
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Handle business logic errors (e.g., invalid owner or members)
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while updating the team", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete a team from the system
    /// DELETE /api/teams/{id}
    /// This will also handle cleanup of related data (members, tasks)
    /// </summary>
    /// <param name="id">Unique identifier of the team to delete</param>
    /// <returns>Success status of deletion operation</returns>
    /// <response code="204">Team successfully deleted</response>
    /// <response code="404">Team not found</response>
    /// <response code="500">Internal server error</response>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteTeam(Guid id)
    {
        try
        {
            // Create command object with team ID
            var command = new DeleteTeamCommand { Id = id };

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
                return StatusCode(500, new { message = "Failed to delete the team" });
            }
        }
        catch (ArgumentException ex)
        {
            // Handle team not found scenario
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while deleting the team", error = ex.Message });
        }
    }

    /// <summary>
    /// Add a new member to an existing team
    /// POST /api/teams/{teamId}/members/{userId}
    /// </summary>
    /// <param name="teamId">Unique identifier of the team</param>
    /// <param name="userId">Unique identifier of the user to add as member</param>
    /// <returns>Success status of the operation</returns>
    /// <response code="200">Member successfully added</response>
    /// <response code="400">Invalid request or business logic error</response>
    /// <response code="404">Team or user not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("{teamId:guid}/members/{userId:guid}")]
    public async Task<ActionResult> AddMemberToTeam(Guid teamId, Guid userId)
    {
        try
        {
            // Create command object with both IDs
            var command = new AddMemberToTeamCommand
            {
                TeamId = teamId,
                UserId = userId
            };

            // Send command through MediatR pipeline
            var result = await _mediator.Send(command);

            // Return success response
            if (result)
            {
                return Ok(new { message = "Member successfully added to team" });
            }
            else
            {
                return StatusCode(500, new { message = "Failed to add member to team" });
            }
        }
        catch (ArgumentException ex)
        {
            // Handle team or user not found
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Handle business logic errors (e.g., already a member)
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while adding member to team", error = ex.Message });
        }
    }

    /// <summary>
    /// Remove a member from an existing team
    /// DELETE /api/teams/{teamId}/members/{userId}
    /// </summary>
    /// <param name="teamId">Unique identifier of the team</param>
    /// <param name="userId">Unique identifier of the user to remove from team</param>
    /// <returns>Success status of the operation</returns>
    /// <response code="200">Member successfully removed</response>
    /// <response code="400">Invalid request or business logic error</response>
    /// <response code="404">Team or user not found</response>
    /// <response code="500">Internal server error</response>
    [HttpDelete("{teamId:guid}/members/{userId:guid}")]
    public async Task<ActionResult> RemoveMemberFromTeam(Guid teamId, Guid userId)
    {
        try
        {
            // Create command object with both IDs
            var command = new RemoveMemberFromTeamCommand
            {
                TeamId = teamId,
                UserId = userId
            };

            // Send command through MediatR pipeline
            var result = await _mediator.Send(command);

            // Return success response
            if (result)
            {
                return Ok(new { message = "Member successfully removed from team" });
            }
            else
            {
                return StatusCode(500, new { message = "Failed to remove member from team" });
            }
        }
        catch (ArgumentException ex)
        {
            // Handle team or user not found
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Handle business logic errors (e.g., not a member, trying to remove owner)
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            return StatusCode(500, new { message = "An error occurred while removing member from team", error = ex.Message });
        }
    }
}
