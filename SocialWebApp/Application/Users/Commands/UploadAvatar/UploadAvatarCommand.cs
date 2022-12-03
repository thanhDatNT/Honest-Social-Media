using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.UploadAvatar;

public record UploadAvatarCommand(
    int UserId,
    FileDto File
) : IRequest<string>;

public class UploadAvatarCommandHandler : IRequestHandler<UploadAvatarCommand, string>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileStorageService _fileStorageService;
    
    public UploadAvatarCommandHandler(IApplicationDbContext context, IFileStorageService fileStorageService)
    {
        _context = context;
        _fileStorageService = fileStorageService;   
    }

    public async Task<string> Handle(UploadAvatarCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.Id == request.UserId);
            if (user == null) throw new NotFoundException(nameof(User), request.UserId);

            var url = await _fileStorageService.UploadAsync(request.File);
            user.Avatar = url;
            Photo photo = new Photo()
            {
                PhotoString = url,
                CreatedAt = DateTime.Now,
                UserId = user.Id
            };
            _context.Photo.Add(photo);
            await _context.SaveChangesAsync();
            return url;
        }
        catch (Exception e)
        {
            throw;
        }
    }
}



