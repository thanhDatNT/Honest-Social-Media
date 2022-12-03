using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Posts.Queries.GetPersonalPosts;

public class GetPersonalPostsQuery: IRequest<PaginatedPostDto>
{
  public int UserId { get; set; }
  public int Offset { get; set; }
  public int Limit { get; set; }
}
public class GetPersonalPostsQueryHandler : IRequestHandler<GetPersonalPostsQuery, PaginatedPostDto>
{
  private IApplicationDbContext _appDb;
  private readonly IMapper _mapper;

  public GetPersonalPostsQueryHandler(IApplicationDbContext appDb, IMapper mapper)
  {
    _appDb = appDb;
    _mapper = mapper;
  }

    public async Task<PaginatedPostDto> Handle(GetPersonalPostsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var foundUser = await _appDb.User.FirstOrDefaultAsync(u=>u.Id==request.UserId);
            if (foundUser == null) throw new NotFoundException();
            var post = await _appDb.Post.Where(p => p.User.Id == request.UserId).Where(p => p.IsDeleted == false)
                .Include(p => p.PostLikes)
                .Include(p => p.Photos)
                .Include(p=>p.Comments)
                .OrderByDescending(p => p.CreatedAt).Include(p => p.User).Skip(request.Offset).Take(request.Limit)
                .ToListAsync();
            
            List<PostDto> postDtos = _mapper.Map<List<PostDto>>(post);
            int totalCount = postDtos.Count();
            bool hasNextPage =await  _appDb.Post.CountAsync(p=>p.User.Id==request.UserId) > request.Offset  + request.Limit;  
            return new PaginatedPostDto()
            {
                Items = postDtos,
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
