using AngryMonkey.Core;
using AngryMonkey.Core.Web;
using Connection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<Connection.FileShare>(provider =>
{
    string connection = builder.Configuration["blob:ConnectionString"];
    Connection.FileShare fileShare = new Connection.FileShare(connection);

    return fileShare;

});

builder.Services.AddSingleton<SharePointGraph>(provider =>
{

    Connection.FileShare fileShare = provider.GetRequiredService<Connection.FileShare>();

    string AppID = builder.Configuration["Sharepoint:ClientID"];
    string TenantID = builder.Configuration["Sharepoint:TenantID"];
    string AppSecret = builder.Configuration["Sharepoint:SecretID"];

    SharePointGraph sharepoint = new(AppID, TenantID, AppSecret, fileShare);

    return sharepoint;
});

var app = builder.Build();

WebCoreConfig.Current.Head = new WebCoreConfigHead()
{
    DefaultTitle = "SharePoint Archiving",
    TitleSuffix = " - SharePoint Archiving",
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
