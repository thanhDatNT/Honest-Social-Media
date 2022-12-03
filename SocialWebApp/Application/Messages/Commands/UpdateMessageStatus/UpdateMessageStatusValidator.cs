using Application.Messages.Commands.UpdateMessageStatus;
using FluentValidation;


public class UpdateMessageStatusCommandValidator:AbstractValidator<UpdateMessageStatusCommand>
{
    public UpdateMessageStatusCommandValidator()
    {
        RuleFor(x => x.MessageId).NotNull().WithMessage("MessageId must be not null").GreaterThanOrEqualTo(0)
            .WithMessage("MessaageId must be larger than 0");
       

    }
}