using Domain.Entities;
using System.Security.Claims;

namespace Application.Common.Interfaces
{
    public interface IIdentityService
    {
        string GenerateAccessToken(User user);
        ICollection<byte[]> CreatePasswordHash(string password);
        string GenerateRefreshToken();
        bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt);
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
