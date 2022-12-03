using System.Collections;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Posts.Queries;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Queries.SearchUsers;

public record SearchUsersQuery
    (int UserId, string SearchString, int Offset = 0, int Limit = 100) : IRequest<SearchUsersListDto>;

public class SearchUsersQueryHandler : IRequestHandler<SearchUsersQuery, SearchUsersListDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SearchUsersQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<SearchUsersListDto> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var lowerCaseKeyword = request.SearchString.ToLower();
            var users = from u in _context.User select u; 
            var userList = await users.Where(u => u.UserName.ToLower().Contains(lowerCaseKeyword)
                                     || (u.FirstName + ' ' + u.LastName).ToLower().Contains(lowerCaseKeyword)
                                     || (u.LastName + ' ' + u.FirstName).ToLower().Contains(lowerCaseKeyword)).OrderBy(u => u.FirstName).AsNoTracking().ToListAsync();

            int totalCount = userList.Count();
            bool hasNextPage = totalCount > request.Limit + request.Offset;
            var searchUsersResult = _mapper.Map<List<User>, List<SearchUserDto>>(userList);

            var friends = await (from f in _context.UserFriends select new {f.SourceUserId, f.FriendId, f.Pending}).AsNoTracking().ToListAsync();
            var notifications = await (from n in _context.Notification select new { n.TriggerUserId, n.UserId })
                .AsNoTracking().ToListAsync();

            searchUsersResult.ForEach(i =>
            {
                if (i.Id == request.UserId)
                {
                    i.Relationship = RelationshipType.Self;
                }
                else if (friends.FirstOrDefault(x => x.FriendId == i.Id && x.SourceUserId == request.UserId && x.Pending == false) != default)
                {
                    i.Relationship = RelationshipType.Friend;
                }
                else if (friends.FirstOrDefault(x => x.FriendId == i.Id && x.SourceUserId == request.UserId && x.Pending == true) != default)
                {
                    if (notifications.FirstOrDefault(x =>
                            x.UserId == request.UserId && x.TriggerUserId == i.Id) != default)
                    {
                        i.Relationship = RelationshipType.WAccept;
                    }
                    else
                    {
                        i.Relationship = RelationshipType.Pending;
                    }
                }
                else
                {
                    i.Relationship = RelationshipType.NotFriend;
                }
            });
            var paginatedList = searchUsersResult.OrderBy(user => user.Relationship).Skip(request.Offset).Take(request.Limit);
            
            return new SearchUsersListDto()
            {
                Users = paginatedList.ToList(),
                TotalCount = totalCount,
                HasNextPage = hasNextPage
            };
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}