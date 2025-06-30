using System;
using AutoMapper;
using MediatR;
using TaskTracker.Application.DTOs.Users;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Users.Queries.GetAllTeamMembers;

public class GetTeamMembersHandler : IRequestHandler<GetTeamMembersQuery, IEnumerable<UserResponseDto>>
{
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;
    public GetTeamMembersHandler(IUserRepository userRepo, IMapper mapper)
    {
        _userRepo = userRepo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserResponseDto>> Handle(GetTeamMembersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userRepo.GetTeamMembersAsync(request.teamID);
        return _mapper.Map<IEnumerable<UserResponseDto>>(users);
    }
}
