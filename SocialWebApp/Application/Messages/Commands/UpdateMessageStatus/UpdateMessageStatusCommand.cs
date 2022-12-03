using Application.Common.Interfaces;
using AutoMapper;
using Domain.Enums;
using MediatR;

namespace Application.Messages.Commands.UpdateMessageStatus;

public class UpdateMessageStatusCommand: IRequest<bool>
{
    public int MessageId  { get; set; }
    
}

public class UpdateMessageStatusCommandHandler : IRequestHandler<UpdateMessageStatusCommand, bool>
{
  private readonly IApplicationDbContext _appDb;
  private readonly IMapper _mapper;

  public UpdateMessageStatusCommandHandler(IApplicationDbContext appDb, IMapper mapper)
  {
    _appDb = appDb;
    _mapper = mapper;
  }

  public async Task<bool> Handle(UpdateMessageStatusCommand request, CancellationToken cancellationToken)
  {
      var message=await _appDb.Message.FindAsync(request.MessageId);
      message.IsRead = true;
      await _appDb.SaveChangesAsync();
         
          return true;
      }
   
}
