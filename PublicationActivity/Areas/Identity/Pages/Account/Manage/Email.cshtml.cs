using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Encodings.Web;
using System.Linq;
using System.Threading.Tasks;
using PublicationActivity.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;

namespace PublicationActivity.Areas.Identity.Pages.Account.Manage
{
    public partial class EmailModel : PageModel
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public bool IsEmailConfirmed { get; set; }

        [TempData]
        public string StatusMessage { get; set; }

        [BindProperty]
        public InputModel Input { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            [Display(Name = "New email")]
            public string NewEmail { get; set; }
        }

        public IActionResult OnGetAsync()
        {
            return this.Redirect("~/");
        }

        public IActionResult OnPostChangeEmailAsync()
        {
            return this.Redirect("~/");
        }

        public IActionResult OnPostSendVerificationEmailAsync()
        {
            return this.Redirect("~/");
        }
    }
}
