using Connection;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

var builder = WebApplication.CreateBuilder(args);
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


var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
