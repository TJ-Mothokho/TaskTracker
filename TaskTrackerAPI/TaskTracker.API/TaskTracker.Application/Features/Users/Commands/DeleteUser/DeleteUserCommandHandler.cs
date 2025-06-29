using System;
using AutoMapper;
using MediatR;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Users.Commands.DeleteUser;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IUserRepository _userRepo;

    public DeleteUserCommandHandler(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepo.GetUserByIdAsync(request.userID);
        var isDeleted = await _userRepo.DeleteUserAsync(user);
        return isDeleted;
    }
}
