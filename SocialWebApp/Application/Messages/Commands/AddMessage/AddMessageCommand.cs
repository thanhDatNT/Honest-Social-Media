using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Messages.Queries.GetUserMessage;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages.Commands.AddMessage;

public class AddMessageCommand : IRequest<UserMessageDto>
{
    public string Content { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }

    public int Type { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AddMessageCommandHandler : IRequestHandler<AddMessageCommand, UserMessageDto>
{
    private readonly IApplicationDbContext _appDb;
    private readonly IMapper _mapper;

    public AddMessageCommandHandler(IApplicationDbContext appDb, IMapper mapper)
    {
        _appDb = appDb;
        _mapper = mapper;
    }

    public async Task<UserMessageDto> Handle(AddMessageCommand request, CancellationToken cancellationToken)
    {
        bool isFriend = await _appDb.UserFriends.AnyAsync(u =>
            (u.SourceUserId == request.SenderId && u.FriendId == request.ReceiverId) ||
            (u.SourceUserId == request.ReceiverId && u.FriendId == request.SenderId));

        if (!isFriend) throw new NotFoundException();
        var addMessage = new Message()
        {
            Content = request.Content,
            IsRead = false,
            ReceiverId = request.ReceiverId,
            SenderId = request.SenderId,
            Type = request.Type,
            CreatedAt = DateTime.UtcNow
        };

        /* MARK AS UNHIDE IF CURRENT STATUS IS HIDE*/
        var userFriend = await _appDb.UserFriends.FirstOrDefaultAsync(uf =>
            uf.SourceUserId == request.SenderId && uf.FriendId == request.ReceiverId);

        if (userFriend.IsHide) userFriend.IsHide = false;
        await _appDb.Message.AddAsync(addMessage);
        await _appDb.SaveChangesAsync();

        addMessage.Receiver = await _appDb.User.FindAsync(addMessage.ReceiverId);
        addMessage.Sender = await _appDb.User.FindAsync(addMessage.SenderId);
        /*
          * CHECK WHETHER THE RECEIVER HIDES THE SENDER MESSAGE
          */
        var checkMessageHide = await _appDb.UserFriends.FirstOrDefaultAsync(uf =>
            uf.SourceUserId == request.ReceiverId && uf.FriendId == request.SenderId && !uf.IsHide);
        var messageDto = _mapper.Map<UserMessageDto>(addMessage);
        if (checkMessageHide == null)
        {
            messageDto.IsTransmit = false;
        }
        return messageDto;
    }
}