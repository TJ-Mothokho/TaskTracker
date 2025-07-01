using Microsoft.AspNetCore.Mvc;
using MediatR;
using TaskTracker.Application.DTOs.Teams;
using TaskTracker.Application.Features.Teams.Commands.CreateTeam;
using TaskTracker.Application.Features.Teams.Commands.UpdateTeam;
using TaskTracker.Application.Features.Teams.Commands.DeleteTeam;
using TaskTracker.Application.Features.Teams.Commands.AddMemberToTeam;
using TaskTracker.Application.Features.Teams.Commands.RemoveMemberFromTeam;
using TaskTracker.Application.Features.Teams.Commands.AddMembersByEmail;
using TaskTracker.Application.Features.Teams.Queries.GetTeamById;
using TaskTracker.Application.Features.Teams.Queries.GetUserTeams;

namespace TaskTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TeamsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("test")]
    public ActionResult<string> Test()
    {
        return Ok("TeamsController is working!");
    }

    [HttpPost]
    public async Task<ActionResult<TeamResponseDto>> CreateTeam([FromBody] CreateTeamRequestDto request)
    {
        try
        {
            var command = new CreateTeamCommand
            {
                Name = request.Name,
                OwnerId = request.OwnerId,
                MemberIds = request.MemberIds
            };

            var result = await _mediator.Send(command);

            return CreatedAtAction(nameof(GetTeamById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the team", error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TeamResponseDto>> GetTeamById(Guid id)
    {
        try
        {
            var query = new GetTeamByIdQuery { TeamId = id };

            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the team", error = ex.Message });
        }
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<TeamResponseDto>>> GetUserTeams(Guid userId)
    {
        try
        {
            var query = new GetUserTeamsQuery { UserId = userId };

            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving user teams", error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TeamResponseDto>> UpdateTeam(Guid id, [FromBody] UpdateTeamRequestDto request)
    {
        try
        {
            if (request.Id != id)
            {
                return BadRequest(new { message = "Team ID in URL does not match ID in request body" });
            }

            var command = new UpdateTeamCommand
            {
                Id = request.Id,
                Name = request.Name,
                OwnerId = request.OwnerId,
                MemberIds = request.MemberIds
            };

            var result = await _mediator.Send(command);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the team", error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteTeam(Guid id)
    {
        try
        {
            var command = new DeleteTeamCommand { Id = id };

            var result = await _mediator.Send(command);

            if (result)
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, new { message = "Failed to delete the team" });
            }
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the team", error = ex.Message });
        }
    }

    [HttpPost("{teamId:guid}/members/{userId:guid}")]
    public async Task<ActionResult> AddMemberToTeam(Guid teamId, Guid userId)
    {
        try
        {
            var command = new AddMemberToTeamCommand
            {
                TeamId = teamId,
                UserId = userId
            };

            var result = await _mediator.Send(command);

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
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while adding member to team", error = ex.Message });
        }
    }

    [HttpDelete("{teamId:guid}/members/{userId:guid}")]
    public async Task<ActionResult> RemoveMemberFromTeam(Guid teamId, Guid userId)
    {
        try
        {
            var command = new RemoveMemberFromTeamCommand
            {
                TeamId = teamId,
                UserId = userId
            };

            var result = await _mediator.Send(command);

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
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while removing member from team", error = ex.Message });
        }
    }

    [HttpPost("{teamId:guid}/members/bulk")]
    public async Task<ActionResult> AddMembersByEmail(Guid teamId, [FromBody] AddMembersByEmailRequestDto request)
    {
        try
        {
            var command = new AddMembersByEmailCommand
            {
                TeamId = teamId,
                Emails = request.Emails
            };

            var result = await _mediator.Send(command);

            if (result)
            {
                return Ok(new { 
                    message = $"Successfully added {request.Emails.Count} member(s) to team",
                    addedEmails = request.Emails
                });
            }
            else
            {
                return StatusCode(500, new { message = "Failed to add members to team" });
            }
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while adding members to team", error = ex.Message });
        }
    }
}
