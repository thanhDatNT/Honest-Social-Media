using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Posts.Queries;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Posts.Commands.LikePost;

public class LikePostCommand : IRequest<PostDto>
{
  public int PostId { get; set; }
  public int UserId { get; set; }
  public LikeStatus Status { get; set; }
}


public class LikePostCommandHandler : IRequestHandler<LikePostCommand, PostDto>
{
  private IApplicationDbContext _appDb;
  private readonly IMapper _mapper;

  public LikePostCommandHandler(IApplicationDbContext appDb, IMapper mapper)
  {
    _appDb = appDb;
    _mapper = mapper;
  }
  public async Task<PostDto> Handle(LikePostCommand request, CancellationToken cancellationToken)
  {
    var foundUser = await _appDb.User.FirstOrDefaultAsync(u => u.Id == request.UserId);
    if (foundUser == null) throw new NotFoundException();

    var foundPost = await _appDb.Post.Where(p => p.Id == request.PostId).Include(p => p.User)
      .Include(p => p.PostLikes).Include(p=>p.Photos)
      .Include(p => p.Comments).FirstOrDefaultAsync();
    var checkUserLiked =
        await _appDb.PostLike.FirstOrDefaultAsync(p =>
            p.PostId == request.PostId && p.UserId == request.UserId);
    if (request.Status == LikeStatus.LIKE && checkUserLiked == null)
    {

      foundPost.NumberOfLikes++;
      _appDb.PostLike.Add(new PostLike()
      {
        UserId = request.UserId,
        PostId = request.PostId
      });
    }
    else if (request.Status == LikeStatus.UNLIKE && checkUserLiked != null)
    {
      foundPost.NumberOfLikes--;
      _appDb.PostLike.Remove(checkUserLiked);
    }

    await _appDb.SaveChangesAsync();
    var postDto = _mapper.Map<PostDto>(foundPost);
    return postDto;
  }
}