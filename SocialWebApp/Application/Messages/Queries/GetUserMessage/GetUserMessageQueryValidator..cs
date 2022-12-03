using Application.Messages.Queries.GetUserMessage;
using FluentValidation;


public class GetUserMessageQueryValidator:AbstractValidator<GetUserMessageQuery>
{
    public GetUserMessageQueryValidator()
    {
        RuleFor(x => x.Limit).NotNull().GreaterThan(0)
            .WithMessage("Limit must be larger than 0");
        RuleFor(x => x.Offset).NotNull().GreaterThanOrEqualTo(0)
            .WithMessage("Offset must be larger than 0");
        RuleFor(x => x.FriendId).NotNull()
            .WithMessage("Friend Id can not be null");
        RuleFor(x => x.UserId).NotNull()
            .WithMessage("User Id can not be null");
    }
}