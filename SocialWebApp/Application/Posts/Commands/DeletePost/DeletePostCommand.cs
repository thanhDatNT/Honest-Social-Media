using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Posts.Queries;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Posts.Commands.DeletePost;

public record DeletePostCommand(int PostId, int UserId) : IRequest<PaginatedPostDto>;

public class DeletePostCommandHandler:IRequestHandler<DeletePostCommand, PaginatedPostDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public DeletePostCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    } 
    
    public async Task<PaginatedPostDto> Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var post =await _context.Post.FindAsync(request.PostId);
            if (post is null)
                throw new NotFoundException("Post is not found");
            if (post.UserId != request.UserId)
            {
                throw new Exception("Invalid user");
            }

            post.IsDeleted = true;
            await _context.SaveChangesAsync();

            var postList = await _context.Post.Where(p => p.User.Id == request.UserId).Where(p => p.IsDeleted == false)
                .Include(p => p.PostLikes)
                .Include(p => p.Photos).Include(p=> p.Comments)
                .OrderByDescending(p => p.CreatedAt).Include(p => p.User)
                .ToListAsync();
            List<PostDto> postDtos = _mapper.Map<List<PostDto>>(postList);
            int totalCount = postDtos.Count();
            return new PaginatedPostDto()
            {
                Items = postDtos,
                TotalCount = totalCount,
                HasNextPage = true
            }; 
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}