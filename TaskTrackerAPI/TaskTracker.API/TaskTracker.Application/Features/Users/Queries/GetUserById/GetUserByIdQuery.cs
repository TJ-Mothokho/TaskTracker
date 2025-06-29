using System;
using MediatR;
using TaskTracker.Application.DTOs.Users;

namespace TaskTracker.Application.Features.Users.Queries.GetUserById;

public record GetUserByIdQuery(Guid userID) : IRequest<UserResponseDto>
{

}
