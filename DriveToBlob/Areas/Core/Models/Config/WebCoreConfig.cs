using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.AzureADB2C.UI;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace AngryMonkey.Core.Web
{
    public partial class WebCoreConfig : CoreConfig
    {

        public WebCoreConfigHead Head = new();
        public WebCoreConfigHeader Header = new();
        public WebCoreConfigFooter Footer = new();
        public WebCoreConfigSidemenu Sidemnu = new();
        public WebCoreConfigGoogleAnalytics GoogleAnalytics = new();

        private static WebCoreConfig _current;
        public static new WebCoreConfig Current
        {
            get
            {
                if (_current != null)
                    return _current;

                #region Get values from Core Config

                foreach (PropertyInfo propertyInfo in CoreConfig.Current.GetType().GetProperties(BindingFlags.Public))
                    propertyInfo.SetValue(CoreConfig.Current, propertyInfo.GetValue(CoreConfig.Current));

                #endregion

                _current = new WebCoreConfig()
                {
                    GoogleAnalytics = Configuration.GetSection("Core:GoogleAnalytics").Get<WebCoreConfigGoogleAnalytics>()
                };

                return _current;
            }
        }

        public static void ConfigureServices(IServiceCollection services)
        {
            // Cookie Policy

            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
                options.HandleSameSiteCookieCompatibility();

            });

            // Basics

            services.AddControllersWithViews()
                .AddNewtonsoftJson();
            services.AddRazorPages();
        }

        public static void Configure<T>(IApplicationBuilder app, IWebHostEnvironment env) where T : class
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                CoreConfig.BuildConfigurationAsDevelopment<T>();
            }
            else
            {
                //app.UseExceptionHandler("/Home/Error");
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            RewriteOptions rewrite = new RewriteOptions().AddRedirect("MicrosoftIdentity/Account/SignedOut", "/");
            app.UseRewriter(rewrite);

            app.UseStatusCodePagesWithRedirects("/");

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseRouting();
           
            if (Current.Security.SignInAvailable)
            {
                app.UseAuthentication();
                app.UseAuthorization();
            }

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                //endpoints.MapRazorPages();
            });
        }
    }
}