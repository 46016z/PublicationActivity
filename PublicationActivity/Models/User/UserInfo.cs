﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicationActivity.Models.User
{
    public class UserInfo
    {
        public string UserId { get; set; }

        public string Role { get; set; }
    }
}
