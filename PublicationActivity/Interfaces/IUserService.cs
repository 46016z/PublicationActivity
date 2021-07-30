using PublicationActivity.Data.Models;
using PublicationActivity.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicationActivity.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsers();

        Task<UserDto> CreatUser(UserDto user);

        Task SendResetPasswordEmail(string userEmail);
    }
}
