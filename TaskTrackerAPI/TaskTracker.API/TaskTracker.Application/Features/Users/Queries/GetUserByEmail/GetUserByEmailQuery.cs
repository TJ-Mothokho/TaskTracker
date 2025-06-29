using System;
using MediatR;
using TaskTracker.Application.DTOs.Users;

namespace TaskTracker.Application.Features.Users.Queries.GetUserByEmail;

public record GetUserByEmailQuery(string email) : IRequest<UserResponseDto>
{

}
