using Application.Common.Interfaces;
using Application.Common.Models;
using AutoMapper;
using Domain.Common.Errors;
using ErrorOr;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Users.Commands.RefreshToken
{
    public record RefreshTokenCommand(
        string AccessToken, string RefreshToken
    ) : IRequest<ErrorOr<AuthenticationResult>>;

    public class RefreshTokenCommandHanlder : IRequestHandler<RefreshTokenCommand, ErrorOr<AuthenticationResult>>
    {
        private readonly IIdentityService _identityService;
        private readonly IApplicationDbContext _context;

        public RefreshTokenCommandHanlder(IIdentityService identityService, IApplicationDbContext context)
        {
            _identityService = identityService;
            _context = context;
        }
        public async Task<ErrorOr<AuthenticationResult>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {    
            string accessToken = request.AccessToken;
            string refreshToken = request.RefreshToken;
            var principal = _identityService.GetPrincipalFromExpiredToken(accessToken);
            var userId = int.Parse(principal.Claims.ToArray()[0].Value); // this is mapped to the sub-name claim
            var user = await _context.User.SingleOrDefaultAsync(u => u.Id == userId);
            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                return AuthenticationError.InvalidCredentials;
            var newAccessToken = _identityService.GenerateAccessToken(user);
            var newRefreshToken = _identityService.GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            await _context.SaveChangesAsync();

            return new AuthenticationResult(null, newAccessToken, newRefreshToken);
        }
    }
}
