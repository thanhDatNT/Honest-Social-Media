using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Queries.GetNotifications;

public record GetNotificationQuery(int UserId) : IRequest<List<NotificationDto>>;

public class GetNotificationQueryHandler : IRequestHandler<GetNotificationQuery, List<NotificationDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    
    public GetNotificationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public async Task<List<NotificationDto>> Handle(GetNotificationQuery request, CancellationToken cancellationToken)
    {
        var notifications = await _context.Notification.Where(u => u.UserId == request.UserId && u.Type == 0).Include(u => u.TriggerUser).OrderByDescending(n => n.CreatedAt).ToListAsync();
        return _mapper.Map<List<Notification>, List<NotificationDto>>(notifications);
    }
}