using FluentValidation;

namespace Application.Users.Commands.CreateUser;

public class CreateUserCommandValidator : AbstractValidator<RegisterCommand>
{
    private readonly string _namePattern = "^[A-Za-z][a-zA-Z\\s]+$";
    private readonly string _userNamePattern = "^[A-Za-z][a-zA-Z0-9]+$";
    private readonly string _emailPattern = "^\\w[a-zA-Z0-9._\\-+\"]+@gmail.com";
    private readonly string _passwordPattern = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$";

    public CreateUserCommandValidator()
    {
        RuleFor(x => x.NewUserDto.FirstName).NotEmpty().Length(2, 50)
            .WithMessage("Firstname must be between 2 and 50 characters").Matches(_namePattern)
            .WithMessage("Firstname is invalid");

        RuleFor(x => x.NewUserDto.LastName).NotEmpty().Length(2, 50)
            .WithMessage("Lastname must be between 2 and 50 characters").Matches(_namePattern)
            .WithMessage("Lastname is invalid");

        RuleFor(x => x.NewUserDto.Gender).NotNull().WithMessage("Gender is require");

        RuleFor(x => x.NewUserDto.UserName).NotEmpty().Length(5, 32)
            .WithMessage("Username must be between 2 and 32 characters").Matches(_userNamePattern).WithMessage(
                "Username does not start with a number and not contain special characters, spaces or symbols");

        RuleFor(x => x.NewUserDto.Email).Matches(_emailPattern).WithMessage("The email is not a valid email address")
            .MaximumLength(256).WithMessage("Your email must be lest than 256 characters").EmailAddress();

        RuleFor(x => x.NewUserDto.Password).Length(8, 32).WithMessage("Password must be between 8 and 32 characters")
            .Matches(_passwordPattern).WithMessage(
                "The password is at least 1 uppercase, 1 lowercase and 1 number. Password must be between 8 and 32 characters");

        RuleFor(x => x.NewUserDto.PhoneNo).MaximumLength(15).WithMessage("Invalid phone number");
    }
}