using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages.Queries.GetUserMessage;

public class GetUserMessageQuery : IRequest<PaginatedUserMessagesDto>
{
    public int UserId { get; set; }
    public int FriendId { get; set; }
    public int Offset { get; set; }
    public int Limit { get; set; }
}

public class GetUserMessageQueryHandler : IRequestHandler<GetUserMessageQuery, PaginatedUserMessagesDto>
{
    private IApplicationDbContext _appDb;
    private readonly IMapper _mapper;

    public GetUserMessageQueryHandler(IApplicationDbContext appDb, IMapper mapper)
    {
        _appDb = appDb;
        _mapper = mapper;
    }

    public async Task<PaginatedUserMessagesDto> Handle(GetUserMessageQuery request, CancellationToken cancellationToken)
    {
        var messages = _appDb.Message.Where(m => ((m.SenderId == request.UserId && m.ReceiverId == request.FriendId)
                                                  || (m.ReceiverId == request.UserId &&
                                                      m.SenderId == request.FriendId)) && !m.IsDeleted);
        int totalCount = messages.Count();
        bool hasNextPage = totalCount > request.Limit + request.Offset;
        var paginatedList = await messages.OrderByDescending(m => m.CreatedAt).Skip(request.Offset).Take(request.Limit)
            .ToListAsync();
        var messagesDto = _mapper.Map<List<UserMessageDto>>(paginatedList);
        return new PaginatedUserMessagesDto()
        {
            Items = messagesDto, TotalCount = totalCount, HasNextPage = hasNextPage
        };
    }

}