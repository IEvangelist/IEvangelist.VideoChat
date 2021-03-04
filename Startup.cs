using IEvangelist.VideoChat.Hubs;
using IEvangelist.VideoChat.Options;
using IEvangelist.VideoChat.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace IEvangelist.VideoChat
{
    public class Startup
    {
        readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration) => _configuration = configuration;

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            services.Configure<TwilioSettings>(settings =>
                    {
                        settings.AccountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
                        settings.ApiSecret = Environment.GetEnvironmentVariable("TWILIO_API_SECRET");
                        settings.ApiKey = Environment.GetEnvironmentVariable("TWILIO_API_KEY");
                    })
                    .AddTransient<IVideoService, VideoService>()
                    .AddSpaStaticFiles(config => config.RootPath = "ClientApp/dist");

            services.AddSignalR();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection()
               .UseStaticFiles()
               .UseSpaStaticFiles();

            app.UseRouting();
            app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllerRoute(
                        name: "default",
                        pattern: "{controller}/{action=Index}/{id?}");

                    endpoints.MapHub<NotificationHub>("/notificationHub");
                })
               .UseSpa(spa =>
                {
                    // To learn more about options for serving an Angular SPA from ASP.NET Core,
                    // see https://go.microsoft.com/fwlink/?linkid=864501
                    spa.Options.SourcePath = "ClientApp";

                    if (env.IsDevelopment())
                    {
                        spa.UseAngularCliServer(npmScript: "start");
                        //spa.UseProxyToSpaDevelopmentServer(_configuration["SpaBaseUrl"] ?? "http://localhost:4200");
                    }
                });
        }
    }
}