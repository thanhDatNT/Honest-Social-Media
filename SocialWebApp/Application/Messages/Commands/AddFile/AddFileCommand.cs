using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Messages.Queries.GetUserMessage;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages.Commands.AddFile;
    
public class AddFileCommand : IRequest<UserMessageDto>
{
    public IFormFile Content { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }

    public int Type { get; set; }
}

public class AddFileCommandHandler : IRequestHandler<AddFileCommand, UserMessageDto>
{
    private readonly IApplicationDbContext _appDb;
    private readonly IMapper _mapper;
    private readonly IFileStorageService _fileStorageService;

    public AddFileCommandHandler(IApplicationDbContext appDb, IMapper mapper, IFileStorageService fileStorageService)
    {
        _appDb = appDb;
        _mapper = mapper;
        _fileStorageService = fileStorageService;
    }

    public async Task<UserMessageDto> Handle(AddFileCommand request, CancellationToken cancellationToken)
    {
        var file = new FileDto
        {
            Content = request.Content.OpenReadStream(),
            Name = request.Content.FileName,
            ContentType = request.Content.ContentType,
        };
        var url = await _fileStorageService.UploadAsync(file,"user/message/");
        var addMessage = new Message()
        {
            Content = url,
            IsRead = false,
            ReceiverId = request.ReceiverId,
            SenderId = request.SenderId,
            Type = request.Type,
            CreatedAt = DateTime.UtcNow
        };
        await _appDb.Message.AddAsync(addMessage);
        await _appDb.SaveChangesAsync();
        addMessage.Receiver = await _appDb.User.FindAsync(addMessage.ReceiverId);
        addMessage.Sender = await _appDb.User.FindAsync(addMessage.SenderId);
        var messageDto = _mapper.Map<UserMessageDto>(addMessage);
        var checkMessageHide = await _appDb.UserFriends.FirstOrDefaultAsync(uf =>
            uf.SourceUserId == request.ReceiverId && uf.FriendId == request.SenderId && !uf.IsHide);
        if (checkMessageHide == null)
        {
            messageDto.IsTransmit = false;
        }
        return messageDto;
    }
}