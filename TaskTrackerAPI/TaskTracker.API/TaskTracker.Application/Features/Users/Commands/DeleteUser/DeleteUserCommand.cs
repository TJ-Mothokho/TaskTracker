using System;
using MediatR;
using TaskTracker.Domain.Interfaces;

namespace TaskTracker.Application.Features.Users.Commands.DeleteUser;

public record DeleteUserCommand(Guid userID) : IRequest<bool>
{
    
}
