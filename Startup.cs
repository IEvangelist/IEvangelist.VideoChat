using IEvangelist.VideoChat.Abstractions;
using IEvangelist.VideoChat.Hubs;
using IEvangelist.VideoChat.Options;
using IEvangelist.VideoChat.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;

namespace IEvangelist.VideoChat
{
    public class Startup
    {
        readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration) => _configuration = configuration;

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.Configure<TwilioSettings>(_configuration.GetSection(nameof(TwilioSettings)))
                    .AddTransient<IVideoService, VideoService>()
                    .AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist/ClientApp"; });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "IEvangelist.VideoChat", Version = "v1" });
            });

            services.AddSignalR();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseSwagger()
               .UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "IEvangelist.VideoChat API v1"))
               .UseHttpsRedirection()
               .UseStaticFiles()
               .UseSpaStaticFiles();

            app.UseSignalR(routes =>
                {
                    routes.MapHub<NotificationHub>("/notificationHub");
                });
            app.UseMvc(routes =>
                {
                    routes.MapRoute(
                        name: "default",
                        template: "{controller}/{action=Index}/{id?}");
                })
               .UseSpa(spa =>
                {
                    // To learn more about options for serving an Angular SPA from ASP.NET Core,
                    // see https://go.microsoft.com/fwlink/?linkid=864501

                    spa.Options.SourcePath = "ClientApp";

                    if (env.IsDevelopment())
                    {
                        spa.UseAngularCliServer(npmScript: "start");
                    }
                });
        }
    }
}