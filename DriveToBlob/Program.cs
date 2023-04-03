using AngryMonkey.CloudWeb;
using Connection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

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


CloudWebConfig cloudWeb = new()
{
    PageDefaults = new()
    {
        Title = "Angry monkey Archive",
        BlazorRenderMode = CloudPageBlazorRenderModes.Server,
        AutoAppendBlazorStyles = true,
        CallingAssemblyName = "DotCompoments",
        Bundles = new()
         {
         new(){ Source = "css/site.css"},
         new(){ Source = "js/site.js"},
         },
    },
    TitleSuffix = " - Angry monkey Archive",
};

builder.Services.AddCloudWeb(cloudWeb);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseBlazorFrameworkFiles();
app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
       name: "default",
       pattern: "{controller=Home}/{action=Index}/{id?}");

    endpoints.MapBlazorHub();
});

await app.RunAsync();
