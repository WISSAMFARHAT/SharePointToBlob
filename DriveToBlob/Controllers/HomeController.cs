using Connection;
using Connection.Model;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
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
            CorePage(Name ?? "index");

            string url = $"";
            if (!string.IsNullOrEmpty(Name))
                url = $"/{Name}";

            List<ItemModel> lists = new();

            if (string.IsNullOrEmpty(ID) && string.IsNullOrEmpty(ListID) && string.IsNullOrEmpty(FolderID))
                lists = await Connection.GraphProvider.ShareGraph.GetAllSides();

            else if (string.IsNullOrEmpty(ListID) && string.IsNullOrEmpty(FolderID))
            {
                lists = await Connection.GraphProvider.ShareGraph.GetAllListSide(ID);
                url += $"/{ID}";
            }
            else if (string.IsNullOrEmpty(FolderID))
            {
                lists = await Connection.GraphProvider.ShareGraph.GetAllFolderList(ID, ListID);
                url += $"/{ID}/{ListID}";
            }
            else
            {
                lists = await Connection.GraphProvider.ShareGraph.GetAllItemsFolder(ID, ListID, FolderID);
                url += $"/{ID}/{ListID}";
            }

            ViewData["Name"] = Name ?? "";
            ViewData["ListID"] = ListID ?? "";
            ViewData["ID"] = ID ?? "";
            ViewData["FolderID"] = FolderID ?? "";
            ViewData["Url"] = url;

            return View(lists);
        }


        [HttpPost]
        [Route("ToBlobStorage")]
        public async Task<IActionResult> ToBlobStorage()
        {
           
            try
            {

                string name = Request.Form["name"][0];
                string id = Request.Form["id"][0];
                string listID = Request.Form["listID"][0];
                string folderID = Request.Form["folderID"][0];
                bool overwrite = Request.Form.ContainsKey("overwrite") ? true : false;

                List<ItemModel> allfiles = await GraphProvider.ShareGraph.GetAll(name.Replace("-", "/"), id, listID, folderID);

                allfiles.Insert(0, new ItemModel
                {
                    FolderID = folderID,
                    Name = name,
                });

                allfiles.Reverse();

                foreach (ItemModel file in allfiles)
                    await GraphProvider.ShareGraph.SaveDelete(id, listID, file, overwrite);

                //allfiles= allfiles.Where(x=>!string.IsNullOrEmpty(x.FolderID)).Reverse().ToList(); 

                //foreach (ItemModel file in allfiles)
                //    await Connection.GraphProvider.ShareGraph.DeleteSubFolderEmpty(id, listID, file.FolderID);

                return Content("ok");
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }
    }
}