using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Users;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Users.Commands.CreateUser;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, UserResponseDto>
{
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepo;

    public CreateUserHandler(IMapper mapper, IUserRepository userRepo)
    {
        _mapper = mapper;
        _userRepo = userRepo;
    }

    public async Task<UserResponseDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = _mapper.Map<User>(request.Dto);
        user = await _userRepo.AddUserAsync(user);
        return _mapper.Map<UserResponseDto>(user);
    }
}

