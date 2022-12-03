using Application.Users.Commands.UploadAvatar;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Users.Commands.AddFriend
{

    public class AddFriendCommandValidator : AbstractValidator<AddFriendCommand>
    {
        public AddFriendCommandValidator()
        {
            RuleFor(v => v.SourceUserId).NotEqual(v => v.ReceiveUserId).WithMessage("Two Ids must be different");
            RuleFor(v => v.ReceiveUserId).NotEqual(v => v.SourceUserId).WithMessage("Two Ids must be different");
        }
    }
}
