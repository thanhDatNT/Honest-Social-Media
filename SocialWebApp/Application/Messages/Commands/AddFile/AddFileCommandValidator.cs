using Application.Messages.Commands.AddFile;
using FluentValidation;
using Microsoft.AspNetCore.Http;


public class AddFileCommandValidator : AbstractValidator<AddFileCommand>
{
    public AddFileCommandValidator()
    {
        RuleFor(x => x.ReceiverId).NotNull()
            .WithMessage("ReceiverId must be not null");
        RuleFor(x => x.SenderId).NotNull()
            .WithMessage("SenderId must be not null");
        RuleFor(v => v.Content).Must(FileNotEmpty).WithMessage("File is required")
            .Must(IsValidContentType).WithMessage("Invalid file type");
    }

    private bool FileNotEmpty(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return false;
        }

        return true;
    }

    private bool IsValidContentType(IFormFile file)
    {
        var validContentTypes = new string[]
        {
            "image/jpeg", "image/png", "image/jpg",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf",
            "text/plain", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };

        if (!validContentTypes.Contains(file.ContentType))
            return false;
        return true;
    }
}