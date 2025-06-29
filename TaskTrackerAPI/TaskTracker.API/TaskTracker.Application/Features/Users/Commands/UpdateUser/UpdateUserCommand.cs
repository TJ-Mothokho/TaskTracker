using System;
using MediatR;
using TaskTracker.Application.DTOs.Users;

namespace TaskTracker.Application.Features.Users.Commands.UpdateUser;

public class UpdateUserCommand : IRequest<UserResponseDto>
{
    public UpdateUserRequestDto Dto { get; set; }
    public UpdateUserCommand(UpdateUserRequestDto dto)
    {
        Dto = dto;
    }
}
