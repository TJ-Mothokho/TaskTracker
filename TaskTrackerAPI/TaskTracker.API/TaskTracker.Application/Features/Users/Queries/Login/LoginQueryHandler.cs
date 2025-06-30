using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Users;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Users.Queries.Login;

public class LoginQueryHandler : IRequestHandler<LoginQuery, UserResponseDto>
{
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;

    public LoginQueryHandler(IUserRepository userRepo, IMapper mapper)
    {
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<UserResponseDto> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepo.LoginAsync(request.Dto.Email, request.Dto.Password);
        return _mapper.Map<UserResponseDto>(user);
    }
}
