using PublicationActivity.Data.Models;
using PublicationActivity.Models.User;

namespace PublicationActivity.Mappers
{
    public static class UserMapper
    {
        public static UserDto FromEntity(this User user, string role)
        {
            return new UserDto
            {
                Username = user.UserName,
                Email = user.Email,
                Role = role
            };
        }
    }
}
