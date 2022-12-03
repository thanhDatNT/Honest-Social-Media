using Application.Common.Models;
using FluentValidation;

namespace Application.Posts.Commands.CreatePost;

public class CreatePostCommandValidator:AbstractValidator<CreatePostCommand>
{
    public CreatePostCommandValidator()
    {
        RuleFor(p=> p.UserId).NotNull().WithMessage("User ID is required");
        RuleFor(p => p.Files).Must(FileArrayLength)
            .WithMessage("The maximum number of uploaded photo is 10 photos. Please try again").Must(IsValidContentType)
            .WithMessage("Invalid file type. '.jpg', '.jpeg', '.png' files are allowed");
        RuleFor(p => p.Status).MaximumLength(1000)
            .WithMessage("The maximum length of uploaded status is 1000 characters. Please try again");
    }
    
    private bool FileArrayLength(ICollection<FileDto> files)
    { 
        if (files.Count > 10)
        {
            return false;
        }
        return true;
    }
    
    private bool IsValidContentType(ICollection<FileDto> files)
    {
        var validContentTypes = new string[] { "image/jpeg", "image/png", "image/jpg" };
        foreach (var file in files)
        {
            if (!validContentTypes.Contains(file.ContentType))
                return false;
        }
        return true;
    }
}