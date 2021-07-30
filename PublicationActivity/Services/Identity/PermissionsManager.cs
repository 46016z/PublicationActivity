using System;
using System.Collections.Generic;

namespace PublicationActivity.Services.Identity
{
    public static class PermissionsManager
    {
        public const string ReadUser = "read:user";
        public const string CreateUser = "create:user";
        public const string UpdateUser = "update:user";
        public const string ReadPublication = "read:publication";
        public const string SearchPublication = "search:publication";
        public const string CreatePublication = "create:publication";

        public static readonly List<string> UserPermissions = new()
        {
            ReadPublication,
            CreatePublication
        };

        public static List<string> GetHeadUserPermissions()
        {
            var headUserPermissions = new List<string>(UserPermissions);

            headUserPermissions.Add(SearchPublication);

            return headUserPermissions;
        }

        public static List<string> GetAllPermissions() {
            var adminPermissions = new List<string>
            {
                CreateUser,
                ReadUser,
                UpdateUser
            };

            adminPermissions.AddRange(GetHeadUserPermissions());

            return adminPermissions;
        }

        public static List<string> GetPermissionsForRole(string roleName)
        {
            switch (roleName)
            {
                case RoleType.User:
                    return UserPermissions;
                case RoleType.HeadUser:
                    return GetHeadUserPermissions();
                case RoleType.Admin:
                    return GetAllPermissions();
                default:
                    throw new ArgumentException("Invalid role");
            }
        }
    }
}
