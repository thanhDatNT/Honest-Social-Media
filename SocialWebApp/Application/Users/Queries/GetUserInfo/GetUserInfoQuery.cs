using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Queries.GetUserInfo;

public class GetUserInfoQuery : IRequest<UserDto>
{
  public int LogInUserId { get; set; }
  public int UserId { get; set; }
}


public class GetUserInfoQueryHandler : IRequestHandler<GetUserInfoQuery, UserDto>
{
  private IApplicationDbContext _appDb;
  private readonly IMapper _mapper;

  public GetUserInfoQueryHandler(IApplicationDbContext appDb, IMapper mapper)
  {
    _appDb = appDb;
    _mapper = mapper;
  }
  public async Task<UserDto> Handle(GetUserInfoQuery request, CancellationToken cancellationToken)
  {
    try
    {
      var user = await _appDb.User.FirstOrDefaultAsync(u => u.Id == request.UserId);
      if (user == null) throw new NotFoundException();
      
      var friends = await (from f in _appDb.UserFriends select new {f.SourceUserId, f.FriendId, f.Pending}).AsNoTracking().ToListAsync();
      var notifications = await (from n in _appDb.Notification select new { n.TriggerUserId, n.UserId }).AsNoTracking()
        .ToListAsync();
      var userDto = _mapper.Map<UserDto>(user);
      if (userDto.Id == request.LogInUserId)
      {
        userDto.Relationship = RelationshipType.Self;
      }
      else if (friends.FirstOrDefault(x =>
                 x.Pending && x.FriendId == userDto.Id && x.SourceUserId == request.LogInUserId) != default)
      {
        if (notifications.FirstOrDefault(x => x.UserId == request.LogInUserId && x.TriggerUserId == request.UserId) != default)
        {
          userDto.Relationship = RelationshipType.WAccept;
        }
        else
        {
          userDto.Relationship = RelationshipType.Pending;
        }
      }
      else if (friends.FirstOrDefault(x =>
                 x.Pending == false && x.FriendId == userDto.Id && x.SourceUserId == request.LogInUserId) != default)
      {
        userDto.Relationship = RelationshipType.Friend;
      }
      else
      {
        userDto.Relationship = RelationshipType.NotFriend;
      }

      return userDto;
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }

  }
}