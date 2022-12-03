using ErrorOr;

namespace Domain.Common.Errors
{
    public class AuthenticationError
    {
        public static Error InvalidCredentials => Error.Validation(
            code: "Auth.InvalidCred",
            description: "Invalid credentials");
    }
}
