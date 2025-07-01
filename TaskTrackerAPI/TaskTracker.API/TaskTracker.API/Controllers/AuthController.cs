using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using TaskTracker.Application.DTOs.Auth;
using TaskTracker.Application.Features.Auth;

namespace TaskTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponseDto>> Register([FromBody] CreateUserRequestDto request)
        {
            try
            {
                var command = new RegisterCommand
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Password = request.Password
                };

                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var query = new LoginQuery
                {
                    Email = request.Email,
                    Password = request.Password
                };

                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (NullReferenceException)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<RefreshTokenResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            try
            {
                var command = new RefreshTokenCommand
                {
                    AccessToken = request.AccessToken,
                    RefreshToken = request.RefreshToken
                };

                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred during token refresh" });
            }
        }

        [HttpPost("logout")]
        public ActionResult Logout()
        {
            return Ok(new { message = "Logged out successfully" });
        }
    }
}
