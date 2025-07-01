using System;
using MediatR;

namespace TaskTracker.Application.Features.Teams.Commands.AddMembersByEmail;

/// <summary>
/// Command to add multiple members to a team using their email addresses
/// Validates that all emails exist as users before adding them to the team
/// </summary>
public record AddMembersByEmailCommand : IRequest<bool>
{
    /// <summary>
    /// Unique identifier of the team to add members to
    /// </summary>
    public required Guid TeamId { get; init; }

    /// <summary>
    /// List of email addresses of users to be added as team members
    /// </summary>
    public required List<string> Emails { get; init; }
}
