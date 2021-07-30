using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicationActivity.Services.Identity
{
    public class HasPermissionRequirement : IAuthorizationRequirement
    {
        public HasPermissionRequirement(string permission) // , string issuer)
        {
            Permission = permission ?? throw new ArgumentNullException(nameof(permission));
            // Issuer = issuer ?? throw new ArgumentNullException(nameof(issuer));
        }

        //public string Issuer { get; }
        public string Permission { get; }
    }
}
