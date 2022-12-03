using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages.Commands.HideMessage;



public class HideMessageCommand: IRequest<bool>
{
    public int UserId  { get; set; }
    public int FriendId { get; set; }
}

public class HideMessageCommandHandler : IRequestHandler<HideMessageCommand, bool>
{
    private readonly IApplicationDbContext _appDb;
    private readonly IMapper _mapper;

    public HideMessageCommandHandler(IApplicationDbContext appDb, IMapper mapper)
    {
        _appDb = appDb;
        _mapper = mapper;
    }

    public async Task<bool> Handle(HideMessageCommand request, CancellationToken cancellationToken)
    {
        var userFriend=await _appDb.UserFriends.FirstOrDefaultAsync(uf =>
            uf.SourceUserId == request.UserId && uf.FriendId == request.FriendId);
        userFriend.IsHide = true;
        await _appDb.SaveChangesAsync();
        return true;
    }
   
}
