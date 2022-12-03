using Application.Common.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Users.Commands.UploadAvatar
{
    public class UploadAvatarCommandValidator : AbstractValidator<UploadAvatarCommand>
    {
        public UploadAvatarCommandValidator()
        {
            RuleFor(v => v.UserId).NotNull().WithMessage("User ID is required");
            RuleFor(v => v.File).Must(FileNotEmpty).WithMessage("File is required")
                .Must(IsValidContentType).WithMessage("Invalid file type. '.jpg', '.jpeg', '.png' files are allowed");
        }

        private bool FileNotEmpty(FileDto file)
        { 
            if (file == null || file.Content.Length == 0)
            {
                return false;
            }
            return true;
        }

        private bool IsValidContentType(FileDto file)
        {
            var validContentTypes = new string[] { "image/jpeg", "image/png", "image/jpg" };

            if (!validContentTypes.Contains(file.ContentType))
                return false;
            return true;
        }
    }
}
