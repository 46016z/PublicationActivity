using PublicationActivity.Models.Publication;
using FluentValidation;
using System;

namespace PublicationActivity.Validation.Validators.Publication
{
    public class PublicationValidator : AbstractValidator<PublicationDto>
    {
        public PublicationValidator()
        {
            RuleFor(b => b.PublicationType)
                .NotEmpty();

            RuleFor(b => b.OriginalTitle)
                .NotEmpty();

            RuleFor(b => b.YearPublished)
                .NotEmpty()
                .GreaterThan(1970)
                .LessThan(DateTime.Now.Year);

            RuleFor(b => b.PublisherData)
                .NotEmpty();

            RuleFor(b => b.Contributors)
                .Must(c => c.Exists(e => !e.IsStudentOrDoctorant));

            RuleForEach(b => b.Contributors)
                .SetValidator(new ContributorValidator());

            RuleFor(b => b.PublicationLanguageCode)
                .NotEmpty()
                .Length(2);
        }
    }
}
