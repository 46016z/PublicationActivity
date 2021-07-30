using PublicationActivity.Data.Models;
using PublicationActivity.Interfaces;
using PublicationActivity.Models.User;
using IdentityModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PublicationActivity.Services.Identity
{
    public class HttpContextIdentityProvider : IIdentityProvider
    {
        private readonly IHttpContextAccessor _httpContext;
        private UserInfo _currentUserInfo;
        private string _currentTraceIdentifier;

        public HttpContextIdentityProvider(IHttpContextAccessor httpContext)
        {
            _httpContext = httpContext;
            _currentUserInfo = null;
            _currentTraceIdentifier = string.Empty;
        }

        public UserInfo GetUserInfo()
        {
            if (_httpContext.HttpContext is null
                || (_httpContext.HttpContext.User.Claims.All(c => c.Type != JwtClaimTypes.Id)) &&
                _httpContext.HttpContext.User.Claims.All(c => c.Type != JwtClaimTypes.Role) &&
                _httpContext.HttpContext.User.Claims.All(c => c.Type != "Permissions"))
            {
                return null;
            }

            if (_currentUserInfo != null && _currentTraceIdentifier == _httpContext.HttpContext.TraceIdentifier)
            {
                return _currentUserInfo;
            }

            var userId = _httpContext.HttpContext.User.Claims.FirstOrDefault(c => c.Type == JwtClaimTypes.Id);
            var role = _httpContext.HttpContext.User.Claims.FirstOrDefault(c => c.Type == JwtClaimTypes.Role);

            _currentUserInfo = new UserInfo
            {
                UserId = userId?.Value,
                Role = role?.Value,
            };

            _currentTraceIdentifier = _httpContext.HttpContext.TraceIdentifier;

            return _currentUserInfo;
        }
    }
}
