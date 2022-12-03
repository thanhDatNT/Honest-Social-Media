using Application.Users.Queries.Login;

namespace Application.Common.Models;

public record AuthenticationResult(
    LoginUserDto? user,
    string AccessToken,
    string RefreshToken
);
