using FluentValidation;

namespace Application.Posts.Commands.CommentPost;

public class CommentPostCommandValidator:AbstractValidator<CommentPostCommand>
{
    public CommentPostCommandValidator()
    {
        RuleFor(p => p.Content).Must(StatusLength)
            .WithMessage("The maximum length of uploaded status is 1000 characters. Please try again");
        RuleFor(p=> p.UserId).NotNull().WithMessage("User ID is required");
        RuleFor(p=> p.PostId).NotNull().WithMessage("Post ID is required");
    }
    
    private bool StatusLength(string status)
    {
        var statusTextArray = status.Split(" ");
        if (statusTextArray.Length > 100)
        {
            return false;
        }
        return true;
    }
}