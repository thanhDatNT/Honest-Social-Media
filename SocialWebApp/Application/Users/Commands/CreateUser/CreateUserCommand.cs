using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.CreateUser;

public class RegisterCommand : IRequest<NewUserVm>
{
  public NewUserDto NewUserDto { get; set; }
}

public class CreateUserHandler : IRequestHandler<RegisterCommand, NewUserVm>
{
  private readonly IApplicationDbContext _appDb;
  private readonly IIdentityService _tokenServices;
  private readonly IMapper _mapper;

  public CreateUserHandler(IApplicationDbContext appDb, IIdentityService tokenServices, IMapper mapper)
  {
    _appDb = appDb;
    _tokenServices = tokenServices;
    _mapper = mapper;
  }
  public async Task<NewUserVm> Handle(RegisterCommand request, CancellationToken cancellationToken)
  {
    try
    {
      var existentUser = await _appDb.User.FirstOrDefaultAsync(u => u.UserName == request.NewUserDto.UserName && u.Email == request.NewUserDto.Email);
      if (existentUser is not null)
      {
        throw new Exception("This email and username already have been existed");
      }
      var existentUserName = await _appDb.User.FirstOrDefaultAsync(u => u.UserName == request.NewUserDto.UserName);
      if (existentUserName is not null)
      {
        throw new Exception("Someone already has that username. Try another");
      }
      var existentEmail = await _appDb.User.FirstOrDefaultAsync(u => u.Email == request.NewUserDto.Email);
      if (existentEmail is not null)
      {
        throw new Exception("This email is already in use. Please use another one");
      }

      var user = _mapper.Map<User>(request.NewUserDto);
      // Save user in database
      var encryptedPassword = _tokenServices.CreatePasswordHash(request.NewUserDto.Password);
      user.PasswordHash = encryptedPassword.First();
      user.PasswordSalt = encryptedPassword.ElementAt(1);
      var result = await _appDb.User.AddAsync(user);
      if (result.State != EntityState.Added)
      {
        throw new Exception("");
      }
      // Return profile data with token
      await _appDb.SaveChangesAsync();
      var newUserVm = _mapper.Map<NewUserVm>(user);
      return newUserVm;
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw new Exception(e.Message);
    }
  }
}
