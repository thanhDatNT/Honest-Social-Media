using FluentValidation;

namespace Application.Users.Queries.GetUserInfo;

public class GetUserInfoQueryValidator:AbstractValidator<GetUserInfoQuery>
{
    public GetUserInfoQueryValidator()
    {
        RuleFor(x => x.UserId).NotNull()
            .WithMessage("User Id can not be null");
        RuleFor(x => x.LogInUserId).NotNull()
            .WithMessage("Logged in User Id can not be null");
    }
}