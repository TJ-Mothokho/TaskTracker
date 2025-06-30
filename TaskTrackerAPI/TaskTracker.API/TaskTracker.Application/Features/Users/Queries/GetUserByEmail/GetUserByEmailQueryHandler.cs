using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Users;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Users.Queries.GetUserByEmail;

public class GetUserByEmailQueryHandler : IRequestHandler<GetUserByEmailQuery, UserResponseDto>
{
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;

    public GetUserByEmailQueryHandler(IUserRepository userRepo, IMapper mapper)
    {
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<UserResponseDto> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepo.GetUserByEmailAsync(request.email);
        return _mapper.Map<UserResponseDto>(user);
    }
}
