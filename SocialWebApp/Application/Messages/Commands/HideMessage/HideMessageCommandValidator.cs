using Application.Messages.Commands.HideMessage;
using FluentValidation;

namespace Application.Messages.Commands.HideMessage;

public class HideMessageCommandValidator:AbstractValidator<HideMessageCommand>
{
    public HideMessageCommandValidator()
    {
        RuleFor(x => x.UserId).NotNull().GreaterThan(0)
            .WithMessage("UserId must be not null");
        RuleFor(x => x.FriendId).NotNull().GreaterThan(0)
            .WithMessage("FriendId must be not null");

    }
}