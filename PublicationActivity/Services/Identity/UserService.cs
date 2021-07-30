using PublicationActivity.Data;
using PublicationActivity.Interfaces;
using PublicationActivity.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Identity.UI.Services;
using PublicationActivity.Data.Models;
using PublicationActivity.Models.User;
using PublicationActivity.CustomExceptions;
using Microsoft.AspNetCore.Http;
using System.Linq;
using PublicationActivity.Mappers;
using System;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;

namespace PublicationActivity.Services.Identity
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IPasswordGenerator passwordGenerator;
        private readonly IEmailSender emailSender;
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserService(
            ApplicationDbContext dbContext,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IPasswordGenerator passwordGenerator,
            IEmailSender emailSender,
            IHttpContextAccessor httpContextAccessor)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.passwordGenerator = passwordGenerator;
            this.emailSender = emailSender;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsers()
        {
            var users = await this.dbContext.Users
                .ToListAsync();

            List<UserDto> results = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await this.userManager.GetRolesAsync(user);
                var userDto = user.FromEntity(roles.First());

                results.Add(userDto);
            }

            return results;
        }

        public async Task<UserDto> CreatUser(UserDto userDto)
        {
            userDto.ValidateAndThrow();

            var existingUser = await userManager.FindByEmailAsync(userDto.Email);

            if (existingUser != null)
            {
                throw new ExceptionWithType(ExceptionType.UserWithEmailAlreadyExists);
            }

            var user = new User
            {
                UserName = userDto.Username,
                Email = userDto.Email,
            };

            var generatedPassword = this.passwordGenerator.GeneratePassword();

            var strategy = this.dbContext.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await this.dbContext.Database.BeginTransactionAsync();

                try
                {
                    var createUserResult = await userManager.CreateAsync(user, generatedPassword);

                    if (!createUserResult.Succeeded)
                    {
                        throw new ExceptionWithType(ExceptionType.UserCreationFailure);
                    }

                    var existingRole = await roleManager.FindByNameAsync(userDto.Role);

                    if (existingRole == null)
                    {
                        throw new ExceptionWithType(ExceptionType.RoleNotFound);
                    }

                    var assignRole = await userManager.AddToRoleAsync(user, userDto.Role);

                    if (!assignRole.Succeeded)
                    {
                        throw new ExceptionWithType(ExceptionType.UserCreationFailure);
                    }

                    var resetPasswordUrl = await this.GetResetPasswordUrl(user);
                    string accountCreatedEmailContent = string.Format(EmailMessages.AccountCreatedContent, generatedPassword, resetPasswordUrl);

                    await this.emailSender.SendEmailAsync(userDto.Email, EmailMessages.AccountCreatedSubject, accountCreatedEmailContent);

                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw ex;
                }

                return user.FromEntity(userDto.Role);
            });
        }

        public async Task SendResetPasswordEmail(string userEmail)
        {
            var user = await this.userManager.FindByEmailAsync(userEmail);

            if (user == null)
            {
                return;
            }

            var resetPasswordUrl = await this.GetResetPasswordUrl(user);

            await this.emailSender.SendEmailAsync(userEmail, EmailMessages.ResetPasswordSubject, string.Format(EmailMessages.ResetPasswordContent, resetPasswordUrl));
        }

        private async Task<string> GetResetPasswordUrl(User user)
        {
            var passwordResetToken = await this.userManager.GeneratePasswordResetTokenAsync(user);
            var encodedPasswordResetToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(passwordResetToken));

            var httpContext = this.httpContextAccessor.HttpContext;
            var baseUrl = $"{httpContext.Request.Scheme}://{httpContext.Request.Host}{httpContext.Request.PathBase}";
            var resetPasswordUrl = $"{baseUrl}/Identity/Account/ResetPassword?code={encodedPasswordResetToken}";

            return HtmlEncoder.Default.Encode(resetPasswordUrl);
        }
    }
}


