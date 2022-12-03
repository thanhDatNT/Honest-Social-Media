using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.HandleAddFriendRequest;

public record HandleAddFriendRequestCommand(int UserId, int TriggerUserId, bool Action) : IRequest<bool>;

public class HandleAddFriendRequestCommandHandler : IRequestHandler<HandleAddFriendRequestCommand, bool>
{
    private readonly IApplicationDbContext _context;
    public HandleAddFriendRequestCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<bool> Handle(HandleAddFriendRequestCommand request, CancellationToken cancellationToken)
    {
        UserFriends? firstUserFriendRecord;
        UserFriends? secondUserFriendRecord;
        var notificationRecord = await _context.Notification.FirstOrDefaultAsync(n =>
            n.UserId == request.UserId && n.TriggerUserId == request.TriggerUserId && n.Type == 0);
        _context.Notification.Remove(notificationRecord);
        if (request.Action == false)
        {
            firstUserFriendRecord = await _context.UserFriends.SingleOrDefaultAsync(u =>
                u.SourceUserId == request.UserId && u.FriendId == request.TriggerUserId);
            _context.UserFriends.Remove(firstUserFriendRecord);
            
            secondUserFriendRecord = await _context.UserFriends.SingleOrDefaultAsync(u =>
                u.SourceUserId == request.TriggerUserId && u.FriendId == request.UserId);
            _context.UserFriends.Remove(secondUserFriendRecord);
            _context.SaveChanges();
        }
        else
        {
            firstUserFriendRecord = await _context.UserFriends.FirstOrDefaultAsync(u =>
                u.SourceUserId == request.UserId && u.FriendId == request.TriggerUserId);
            firstUserFriendRecord.Pending = false;
            secondUserFriendRecord = await _context.UserFriends.FirstOrDefaultAsync(u =>
                u.SourceUserId == request.TriggerUserId && u.FriendId == request.UserId);
            secondUserFriendRecord.Pending = false;
        }
        await _context.SaveChangesAsync();
        return true;
    }
}