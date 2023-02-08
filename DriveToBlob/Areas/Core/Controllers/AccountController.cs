using AngryMonkey.Core.Web.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Web;

[Route("Account")]
public class AccountController : Controller
{
    [Route("GetSideMenu")]
    public ActionResult AccountSidebar()
    {
        return PartialView("~/Areas/Core/Views/Account/Menu.cshtml");
    }
}