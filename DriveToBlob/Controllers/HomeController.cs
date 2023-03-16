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

        private readonly SharePointGraph _sharePointGraph;

        public HomeController(SharePointGraph sharepointgraph)
        {
            _sharePointGraph = sharepointgraph;
        }

        [Route("{Name?}/{ID?}/{ListID?}/{FolderID?}")]
        public async Task<IActionResult> Index(string? Name, string ID, string ListID, string FolderID)
        {
            CorePage(Name);

            string url = $"";

            if (!string.IsNullOrEmpty(Name))
                url = $"/{Name}";

            List<ItemModel> lists = new();

            if (string.IsNullOrEmpty(ID) && string.IsNullOrEmpty(ListID) && string.IsNullOrEmpty(FolderID))
                lists = await _sharePointGraph.GetAllSides();

            else if (string.IsNullOrEmpty(ListID) && string.IsNullOrEmpty(FolderID))
            {
                lists = await _sharePointGraph.GetAllListSide(ID);
                url += $"/{ID}";
            }
            else if (string.IsNullOrEmpty(FolderID))
            {
                lists = await _sharePointGraph.GetAllFolderList(ID, ListID);
                url += $"/{ID}/{ListID}";
            }
            else
            {
                lists = await _sharePointGraph.GetAllItemsFolder(ID, ListID, FolderID);
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
        public async Task<IActionResult> ToBlobStorage(string name, string id, string listID, string folderID, bool overwrite)
        {
            try
            {
                List<ItemModel> allfiles = new()
                {
                    new ItemModel
                    {
                        FolderID = folderID,
                        Name = name,
                    }
                };
                allfiles.AddRange(await _sharePointGraph.GetAll(name.Replace("-", "/"), id, listID, folderID));

                allfiles.Reverse();
                List<Task> task = new();

                foreach (ItemModel file in allfiles)
                    task.Add(_sharePointGraph.SaveDelete(id, listID, file, overwrite));


                Task.WaitAll(task.ToArray());

                allfiles = allfiles.Where(x => !string.IsNullOrEmpty(x.FolderID)).ToList();

                foreach (ItemModel file in allfiles)
                    await _sharePointGraph.DeleteSubFolderEmpty(id, listID, file.FolderID);

                return RedirectToAction("Index", new { Name = name, ID = id, ListID = listID, FolderID = folderID });
            }
            catch (Exception e)
            {
                return RedirectToAction("Index", new { Name = name, ID = id, ListID = listID, FolderID = folderID });
            }
        }
    }
}