using System;
using MediatR;
using TaskTracker.Application.DTOs.Users;

namespace TaskTracker.Application.Features.Users.Queries.GetAllTeamMembers;

public record GetTeamMembersQuery(Guid teamID) : IRequest<IEnumerable<UserResponseDto>>
{
}
