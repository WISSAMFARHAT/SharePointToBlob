using Connection;
using Connection.Model;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using Website.Controllers;
using static Azure.Core.HttpHeader;
using static Microsoft.Graph.Constants;

namespace DriveToBlob.Controllers
{
    [Route("")]
    public class HomeController : BaseController
    {

        [Route("{Name?}/{ID?}/{ListID?}/{FolderID?}")]
        public async Task<IActionResult> Index(string Name, string ID, string ListID, string FolderID)
        {
            CloudPage(string.IsNullOrEmpty(Name)? String.Empty: Name);

            SiteModel site = new()
            {
                ID = ID,
                FolderID = FolderID,
                ListID = ListID,
                Name = Name,
            };


            return View(site);
        }

    }
}