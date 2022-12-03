using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Users.Queries.GetUserInfo;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Posts.Queries.GetNewsfeedPosts;

public class GetPostsQuery : IRequest<PaginatedPostDto>
{
  public int UserId { get; set; }
  public int Offset { get; set; }
  public int Limit { get; set; }
}

public class GetPostsQueryHandler : IRequestHandler<GetPostsQuery, PaginatedPostDto>
{
  private IApplicationDbContext _appDb;
  private readonly IMapper _mapper;

  public GetPostsQueryHandler(IApplicationDbContext appDb, IMapper mapper)
  {
    _appDb = appDb;
    _mapper = mapper;
  }


  public async Task<PaginatedPostDto> Handle(GetPostsQuery request, CancellationToken cancellationToken)
  {
    try
    {
      var foundUser = await _appDb.User.FirstOrDefaultAsync(u => u.Id == request.UserId);
      if (foundUser == null) throw new NotFoundException();
      var listFriends = await _appDb.UserFriends.Where(uf => uf.SourceUserId == request.UserId && uf.Pending == false).ToListAsync();
      var friendIds = new HashSet<int>(listFriends.Select(x => x.FriendId));
      var posts = await _appDb.Post.Where(p=> p.IsDeleted == false)
        .Where(p => p.UserId == request.UserId || friendIds.Contains(p.UserId)).Include(p => p.User)
        .Include(p => p.Photos)
        .Include(p => p.PostLikes).Include(p => p.Comments).OrderByDescending(p => p.CreatedAt).ToListAsync();
      int totalPost = posts.Count();
      bool hasNextPage = totalPost > request.Offset + request.Limit;

      var paginatedPosts = posts.Skip(request.Offset).Take(request.Limit);
      foreach (var post in paginatedPosts)
      {
        var postLike = await _appDb.PostLike.Where(pl => pl.PostId == post.Id).ToListAsync();
        post.PostLikes = postLike;
      }

      List<PostDto> postDtos = _mapper.Map<List<PostDto>>(paginatedPosts);
      int totalCount = postDtos.Count();


      return new PaginatedPostDto() { Items = postDtos, TotalCount = totalCount, HasNextPage = hasNextPage };
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }

  }
}