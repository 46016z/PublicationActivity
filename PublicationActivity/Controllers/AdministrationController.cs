using PublicationActivity.Interfaces;
using PublicationActivity.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using PublicationActivity.Models.User;
using PublicationActivity.Services.Identity;

namespace PublicationActivity.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministrationController : Controller
    {
        private readonly IUserService userService;

        public AdministrationController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpGet("user/all")]
        [Authorize(PermissionsManager.ReadUser)]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers() => Ok(await this.userService.GetAllUsers());

        [HttpPost("user")]
        [Authorize(PermissionsManager.CreateUser)]
        public async Task<ActionResult<UserDto>> CreatUser([FromBody] UserDto user) => Ok(await this.userService.CreatUser(user));

        [HttpPost("resetPassword")]
        [Authorize(PermissionsManager.UpdateUser)]
        public async Task<ActionResult> SendResetPasswordEmail([FromBody] string userEmail)
        {
            await this.userService.SendResetPasswordEmail(userEmail);

            return Ok();
        }
    }
}
