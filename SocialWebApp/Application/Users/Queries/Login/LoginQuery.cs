using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Domain.Common.Errors;
using ErrorOr;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Queries.Login
{
    public record LoginQuery(
        string Username, string Password
        ) : IRequest<ErrorOr<AuthenticationResult>>;

    public class LoginQueryHandler : IRequestHandler<LoginQuery, ErrorOr<AuthenticationResult>>
    {

        private readonly IIdentityService _identityService;
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public LoginQueryHandler(IIdentityService identityService, IApplicationDbContext context, IMapper mapper)
        {
            _identityService = identityService;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ErrorOr<AuthenticationResult>> Handle(LoginQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.UserName == request.Username);
            if (user == null) return AuthenticationError.InvalidCredentials;

            if (!_identityService.VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
                return AuthenticationError.InvalidCredentials;

            var accessToken = _identityService.GenerateAccessToken(user);
            var refreshToken = _identityService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            await _context.SaveChangesAsync();
            return new AuthenticationResult(_mapper.Map<LoginUserDto>(user), accessToken, refreshToken);
        }
    }
}
