using Application.Messages.Queries.GetUsersMessage;
using FluentValidation;


public class GetUsersMessageQueryValidator:AbstractValidator<GetUsersMessageQuery>
{
    public GetUsersMessageQueryValidator()
    {
        RuleFor(x => x.UserId).NotNull()
            .WithMessage("User Id can not be null");
    }
}