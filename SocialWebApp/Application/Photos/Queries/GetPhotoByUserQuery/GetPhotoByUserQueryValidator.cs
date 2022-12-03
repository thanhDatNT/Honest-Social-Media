using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Photos.Queries.GetPhotoByUserQuery
{
    public class GetPhotoByUserQueryValidator : AbstractValidator<GetPhotoByUserQuery>
    {
        public GetPhotoByUserQueryValidator()
        {
            RuleFor(v => v.Offset).GreaterThanOrEqualTo(0).WithMessage("Offset must be greater than or equal to 0");
            RuleFor(v => v.Limit).GreaterThan(0).WithMessage("Limit must be greater than 0");
        }
    }
}
