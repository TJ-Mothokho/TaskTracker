using System;
using MediatR;
using TaskTracker.Application.DTOs.Users;

namespace TaskTracker.Application.Features.Users.Commands.CreateUser;

public class CreateUserCommand : IRequest<UserResponseDto>
{
    public CreateUserRequestDto Dto { get; set; }

    public CreateUserCommand(CreateUserRequestDto dto)
    {
        Dto = dto;
    }
}

