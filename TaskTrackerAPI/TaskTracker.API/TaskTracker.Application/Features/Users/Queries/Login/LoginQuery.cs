using System;
using MediatR;
using TaskTracker.Application.DTOs.Users;

namespace TaskTracker.Application.Features.Users.Queries.Login;

public class LoginQuery : IRequest<UserResponseDto>
{
    public LoginRequestDto Dto { get; set; }

    public LoginQuery(LoginRequestDto dto)
    {
        Dto = dto;
    }
}
