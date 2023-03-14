using AngryMonkey.Core;
using AngryMonkey.Core.Web;
using Connection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();


GraphProvider.FileStorage = new(builder.Configuration["blob:ConnectionString"]);

GraphProvider.ShareGraph = new(builder.Configuration["Sharepoint:ClientID"],
     builder.Configuration["Sharepoint:TenantID"],
      builder.Configuration["Sharepoint:SecretID"]);


var app = builder.Build();

WebCoreConfig.Current.Head = new WebCoreConfigHead()
{
    DefaultTitle = "ShareToBlob",
    TitleSuffix = " - ShareToBlob",
    Bundles = new string[]
    {
        "js/site.js",
        "css/site.css"
    }
};


WebCoreConfig.Current.Header = new WebCoreConfigHeader()
{
    Html = new string[] { "Views/Shared/Compoments/Header.cshtml" }
};

//WebCoreConfig.Current.Footer = new WebCoreConfigFooter()
//{
//    Html = new string[] { "Views/Shared/Compoments/Footer.cshtml" }
//};
//WebCoreConfig.Current.Sidemnu = new WebCoreConfigSidemenu()
//{
//    Html = new string[] { "Views/Shared/Compoments/Sidemenu.cshtml" }
//};



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
