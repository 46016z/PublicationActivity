using PublicationActivity.Data.Models;
using IdentityModel;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PublicationActivity.Services.Identity
{
    public class ProfileService : IProfileService
    {
        private readonly UserManager<User> userManager;

        public ProfileService(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var roleClaims = context.Subject.FindAll(JwtClaimTypes.Role);
            var scopeClaims = context.Subject.FindAll(CustomClaimTypes.Permission);

            User user = await this.userManager.GetUserAsync(context.Subject);

            context.IssuedClaims.Add(new Claim(JwtClaimTypes.Id, user.Id));
            context.IssuedClaims.Add(new Claim(JwtClaimTypes.Name, user.UserName));

            foreach (var item in scopeClaims)
            {
                context.IssuedClaims.Add(new Claim(CustomClaimTypes.Permission, item.Value));
            }

            context.IssuedClaims.AddRange(roleClaims);
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            context.IsActive = (await this.userManager.GetUserAsync(context.Subject)) != null;
        }
    }
}
