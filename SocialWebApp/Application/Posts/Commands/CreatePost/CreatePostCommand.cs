using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Posts.Commands.CreatePost;

public record CreatePostCommand(
    int UserId,
    ICollection<FileDto> Files,
    string Status
) : IRequest<bool>;

public class CreatePostCommandHandler:IRequestHandler<CreatePostCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;

    public CreatePostCommandHandler(IApplicationDbContext context, IFileStorageService fileStorageService)
    {
        _context = context;
        _fileStorageService = fileStorageService;
    }
    
    public async Task<bool> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        try
        {
            List<string> urls = new List<string>();
            var user = await _context.User.FirstOrDefaultAsync(u => u.Id == request.UserId);
            if (user == null) throw new NotFoundException(nameof(User), request.UserId);

            foreach (var requestFile in request.Files)
            {
                var url = await _fileStorageService.UploadAsync(requestFile);
                urls.Add(url);
            }

            List<PostPhoto> postPhotos = new List<PostPhoto>();
            foreach (var url in urls)
            {
                postPhotos.Add(new PostPhoto() { Photo = url });
            }

            Post post = new Post()
            {
                Status = request.Status,
                Photos = postPhotos,
                NumberOfComments = 0,
                NumberOfLikes = 0,
                IsDeleted = false,
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _context.Post.AddAsync(post);
            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception e)
        {
            throw e;
        }
    }
}