using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Users;
using TaskTracker.Domain.Entities;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Users.Queries.GetUserById;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserResponseDto>
{
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;
    public GetUserByIdQueryHandler(IUserRepository userRepo, IMapper mapper)
    {
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<UserResponseDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepo.GetUserByIdAsync(request.userID);
        return _mapper.Map<UserResponseDto>(user);
    }
}
