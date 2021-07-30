using PublicationActivity.Models.User;
using FluentValidation;

namespace PublicationActivity.Validation.Validators.User
{
    public class UserValidator : AbstractValidator<UserDto>
    {
        public UserValidator()
        {
            RuleFor(u => u.Username)
                .NotEmpty()
                .Matches("^[A-Za-z0-9]+$");

            RuleFor(u => u.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(u => u.Role)
                .NotEmpty();
        }
    }
}
