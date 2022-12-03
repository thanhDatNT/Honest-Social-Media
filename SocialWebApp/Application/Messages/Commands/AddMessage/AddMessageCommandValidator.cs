using Application.Messages.Commands.AddMessage;
using FluentValidation;


public class AddMessageCommandValidator:AbstractValidator<AddMessageCommand>
{
    public AddMessageCommandValidator()
    {
        RuleFor(x => x.ReceiverId).NotNull()
            .WithMessage("ReceiverId must be not null");
        RuleFor(x => x.SenderId).NotNull()
            .WithMessage("SenderId must be not null");

    }
}