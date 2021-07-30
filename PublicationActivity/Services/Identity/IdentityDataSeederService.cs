using PublicationActivity.Data;
using PublicationActivity.Data.Models;
using IdentityModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace PublicationActivity.Services.Identity
{
    public class IdentityDataSeederService : IHostedService
    {
        private readonly IServiceProvider serviceProvider;
        public IdentityDataSeederService(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await this.ConfigureDefaultRolesAndUsers(cancellationToken);
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

        // return IdentityResult and fail if something is not created
        private async Task ConfigureDefaultRolesAndUsers(CancellationToken cancellationToken)
        {
            using var scope = this.serviceProvider.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            await ConfigureDefaultRolePermissions();

            var adminEmail = configuration["AdminUser:Email"];
            var existingAdminUser = await userManager.FindByEmailAsync(adminEmail);

            if (existingAdminUser == null)
            {
                var adminUser = new User
                {
                    UserName = configuration["AdminUser:Username"],
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var createAdmin = await userManager.CreateAsync(adminUser, configuration["AdminUser:Password"]);
                if (createAdmin.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, RoleType.Admin);
                }
            }

            await context.SaveChangesAsync(cancellationToken);
        }

        private async Task ConfigureDefaultRolePermissions()
        {
            using var scope = this.serviceProvider.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

            var roles = new List<string> { RoleType.Admin, RoleType.HeadUser, RoleType.User };

            Dictionary<string, Claim> claims = new Dictionary<string, Claim>();

            foreach (var roleName in roles)
            {
                var role = await roleManager.FindByNameAsync(roleName);

                if (role == null)
                {
                    var newRole = new IdentityRole(roleName);
                    await roleManager.CreateAsync(newRole);

                    var permissions = PermissionsManager.GetPermissionsForRole(roleName);

                    foreach (var permission in permissions)
                    {
                        if (!claims.TryGetValue(permission, out Claim claim))
                        {
                            claim = new Claim(CustomClaimTypes.Permission, permission);
                            claims.Add(permission, claim);
                        }

                        await roleManager.AddClaimAsync(newRole, claim);
                    }
                }
            }
        }
    }
}
