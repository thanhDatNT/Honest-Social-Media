using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Posts.Queries;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Posts.Commands.CommentPost;

public record CommentPostCommand(
   string Content, int PostId, int UserId) : IRequest<PostDto>;

public class CommentPostCommandHandler:IRequestHandler<CommentPostCommand, PostDto>
{
   private readonly IApplicationDbContext _appDb;
   private readonly IMapper _mapper;

   public CommentPostCommandHandler(IApplicationDbContext appDb,IMapper mapper )
   {
      _appDb = appDb;
      _mapper = mapper;
   }
   
   public async Task<PostDto> Handle(CommentPostCommand request, CancellationToken cancellationToken)
   {
      try
      {
         // Find current user
         var currentUser = await _appDb.User.FirstOrDefaultAsync(u=>u.Id==request.UserId);
         if (currentUser == null) throw new NotFoundException();
         // Add comment to the comment table
         await _appDb.Comment.AddAsync(new Comment()
            { Content = request.Content, PostId = request.PostId, UserId = request.UserId, CreatedAt = DateTime.UtcNow });
         //Find and return current post
         var currentPost = await _appDb.Post.Where(p => p.Id == request.PostId && p.IsDeleted == false)
            .Include(p => p.Photos)
            .Include(p => p.Comments)
            .Include(p => p.User).Include(p => p.PostLikes).FirstOrDefaultAsync();
         if (currentPost == null) throw new NotFoundException();
         currentPost.NumberOfComments++;
         await _appDb.SaveChangesAsync();
         var postDto = _mapper.Map<PostDto>(currentPost);
         return postDto;
      }
      catch (Exception e)
      {
         Console.WriteLine(e);
         throw;
      }
   }
}