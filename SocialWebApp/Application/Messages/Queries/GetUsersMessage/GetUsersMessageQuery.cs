using Application.Common.Interfaces;
using Application.Messages.Queries.GetUserMessage;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages.Queries.GetUsersMessage;

public class GetUsersMessageQuery : IRequest<List<UserMessageDto>>
{
    public int UserId { get; set; }
    public bool ShowHide { get; set; } = false;
}

public class GetUsersMessageQueryHandler : IRequestHandler<GetUsersMessageQuery, List<UserMessageDto>>
{
    private IApplicationDbContext _appDb;
    private readonly IMapper _mapper;

    public GetUsersMessageQueryHandler(IApplicationDbContext appDb, IMapper mapper)
    {
        _appDb = appDb;
        _mapper = mapper;
    }

    public async Task<List<UserMessageDto>> Handle(GetUsersMessageQuery request, CancellationToken cancellationToken)
    {
        var userListFriends= new List<UserFriends>();
        if (request.ShowHide)
        {
             userListFriends = await _appDb.UserFriends
                .Where(uf => uf.SourceUserId == request.UserId ).Include(uf => uf.SourceUser).Include(uf => uf.Friend)
                .ToListAsync();
        }
        else
        {
            userListFriends = await _appDb.UserFriends
                .Where(uf => uf.SourceUserId == request.UserId && !uf.IsHide ).Include(uf => uf.SourceUser).Include(uf => uf.Friend)
                .ToListAsync();
        }
      
        var messages = new List<Message>();
        foreach (var friend in userListFriends)
        {
            var message = await _appDb.Message.OrderBy(m => m.CreatedAt).LastOrDefaultAsync(m =>
                ((m.SenderId == request.UserId && m.ReceiverId == friend.FriendId)
                 || (m.SenderId == friend.FriendId && m.ReceiverId == request.UserId)) && !m.IsDeleted  );
            if (message != null)
                messages.Add(message);
        }

        var messageDto = _mapper.Map<List<UserMessageDto>>(messages.OrderByDescending(m=>m.CreatedAt));

        return messageDto;
    }
}