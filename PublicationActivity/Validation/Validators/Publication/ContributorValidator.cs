using PublicationActivity.Models.Publication;
using FluentValidation;

namespace PublicationActivity.Validation.Validators.Publication
{
    public class ContributorValidator : AbstractValidator<ContributorDto>
    {
        public ContributorValidator()
        {
            RuleFor(c => c.FirstName)
                .NotEmpty();

            RuleFor(c => c.LastName)
                .NotEmpty();
        }
    }
}
