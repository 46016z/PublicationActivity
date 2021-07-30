using PublicationActivity.Models.Publication;
using PublicationActivity.Models.User;
using PublicationActivity.Validation.Validators.Publication;
using PublicationActivity.Validation.Validators.User;
using FluentValidation;
using FluentValidation.Results;
using System;
using System.Threading.Tasks;

namespace PublicationActivity.Validation
{
    public static class ValidatorHelper
    {
        public static void ValidateAndThrow(this PublicationDto publication)
        {
            if (publication == null)
            {
                throw new ArgumentNullException(nameof(publication));
            }

            new PublicationValidator().ValidateAndThrow(publication);
        }

        public static Task<ValidationResult> Validate(this PublicationDto publication)
        {
            if (publication == null)
            {
                throw new ArgumentNullException(nameof(publication));
            }

            return new PublicationValidator().ValidateAsync(publication);
        }

        public static void ValidateAndThrow(this UserDto user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            new UserValidator().ValidateAndThrow(user);
        }
    }
}
