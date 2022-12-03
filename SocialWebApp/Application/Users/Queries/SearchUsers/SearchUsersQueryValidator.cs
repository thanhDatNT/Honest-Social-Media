
using FluentValidation;

namespace Application.Users.Queries.SearchUsers;

public class SearchFriendsQueryValidator : AbstractValidator<SearchUsersQuery>
{
    public SearchFriendsQueryValidator()
    {
        RuleFor(v => v.SearchString).NotEmpty().WithMessage("Search string must not be empty.");
        RuleFor(v => v.Offset).GreaterThanOrEqualTo(0).WithMessage("Offset must be greater than or equal to 0");
        RuleFor(v => v.Limit).GreaterThan(0).WithMessage("Limit must be greater than 0");
    }
}