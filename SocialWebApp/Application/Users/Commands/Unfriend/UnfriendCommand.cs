using Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Users.Commands.Unfriend
{
    public record UnfriendCommand(int UserId, int FriendId) : IRequest<bool>;

    public class UnfriendCommandHandler : IRequestHandler<UnfriendCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public UnfriendCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UnfriendCommand request, CancellationToken cancellationToken)
        {
            var firstRecordUserFriend = _context.UserFriends.SingleOrDefault(f => f.SourceUserId == request.UserId && f.FriendId == request.FriendId);
            _context.UserFriends.Remove(firstRecordUserFriend);
            var secondRecordUserFriend = _context.UserFriends.SingleOrDefault(f => f.SourceUserId == request.FriendId && f.FriendId == request.UserId);
            _context.UserFriends.Remove(secondRecordUserFriend);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
