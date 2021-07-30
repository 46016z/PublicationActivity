using PublicationActivity.Interfaces;
using PublicationActivity.Services;
using PublicationActivity.Services.Identity;
using PublicationActivity.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace PublicationActivity.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static void AddCustomServices(this IServiceCollection services)
        {
            services.AddSingleton<IIdentityProvider, HttpContextIdentityProvider>();

            services.AddScoped<IPasswordGenerator, PasswordGenerator>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPublicationsService, PublicationsService>();
        }
    }
}
