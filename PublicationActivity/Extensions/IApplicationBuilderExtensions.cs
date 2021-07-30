using PublicationActivity.CustomExceptions;
using PublicationActivity.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System.Net;

namespace PublicationActivity.Extensions
{
    public static class IApplicationBuilderExtensions
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        string exceptionDetails = null;

                        if (contextFeature.Error is ExceptionWithType exception)
                        {
                            exceptionDetails = new ExceptionDetails()
                            {
                                StatusCode = context.Response.StatusCode,
                                ExceptionType = exception.Type,
                                Description = exception.Message
                            }.ToString();
                        }
                        else
                        {
                            exceptionDetails = new ExceptionDetails()
                            {
                                StatusCode = context.Response.StatusCode,
                                ExceptionType = "Internal Server Error",
                                Description = contextFeature.Error.Message
                            }.ToString();
                        }

                        await context.Response.WriteAsync(exceptionDetails);
                    }
                });
            });
        }
    }
}
