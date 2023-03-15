using Connection.Model;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;
using Microsoft.SharePoint.Client;
using static System.Net.Mime.MediaTypeNames;
using Azure.Core;
using System.Net.Http;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.IO;
using static System.Net.WebRequestMethods;
using Newtonsoft.Json.Linq;

namespace Connection
{
    public class SharePointGraph
    {
        private static string AppID { get; set; }
        private static string TenantID { get; set; }
        private static string AppSecret { get; set; }

        private string[] scopes = new string[] { "https://graph.microsoft.com/.default" };
        private IConfidentialClientApplication App { get; set; }

        private static GraphServiceClient _microsoft;

        private static HttpClient httpClient = new();
        public SharePointGraph(string appID, string tenantID, string appSecret)
        {

            AppID = appID;
            TenantID = tenantID;
            AppSecret = appSecret;
            App = ConfidentialClientApplicationBuilder
                .Create(AppID)
                .WithTenantId(TenantID)
                .WithClientSecret(AppSecret)
                .Build();

            AuthenticationResult result = App.AcquireTokenForClient(scopes).ExecuteAsync().Result;

            // Initialize the Graph client
            _microsoft = new GraphServiceClient(new DelegateAuthenticationProvider(
                (requestMessage) =>
                {
                    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", result.AccessToken);
                    return Task.CompletedTask;
                }));

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpClient.DefaultRequestHeaders.Authorization = new("Bearer", result.AccessToken);

            _microsoft.HttpProvider.OverallTimeout = TimeSpan.FromHours(1);

        }

        public async Task<List<ItemModel>> GetAllSides()
        {
            try
            {
                List<Microsoft.Graph.Site> sites = _microsoft.Sites.Request().GetAsync().Result.Where(x => x.WebUrl.Contains("/sites/")).ToList();

                List<ItemModel> sitesModel = new();

                foreach (Microsoft.Graph.Site? site in sites)
                {
                    sitesModel.Add(new()
                    {
                        ID = site.Id,
                        Name = site.Name,
                        WebUrl = site.WebUrl,
                    });
                }

                return sitesModel;
            }
            catch
            {
                return new();
            }
        }

        public async Task<List<ItemModel>> GetAllListSide(string ID)
        {
            try
            {
                List<Microsoft.Graph.List> lists = _microsoft.Sites[ID].Lists.Request().GetAsync().Result.Where(x => !x.WebUrl.Contains("/Lists/")).ToList();
                List<ItemModel> listModel = new();

                foreach (var list in lists)
                {
                    listModel.Add(new()
                    {
                        ID = list.Id,
                        Name = list.Name,
                        WebUrl = list.WebUrl,
                    });
                }

                return listModel;
            }
            catch
            {
                return new();
            }
        }
        public async Task<List<ItemModel>> GetAllFolderList(string ID, string listID)
        {
            try
            {
                IDriveItemChildrenCollectionPage items = await _microsoft.Sites[ID].Lists[listID].Drive.Root.Children.Request().GetAsync();
                List<ItemModel> itemsModel = new();

                foreach (var item in items)
                {
                    itemsModel.Add(new()
                    {
                        ID = item.Id,
                        Name = item.Name,
                        WebUrl = item.WebUrl,
                    });
                }

                return itemsModel;
            }
            catch
            {
                return new();
            }
        }

        public async Task<List<ItemModel>> GetAllItemsFolder(string ID, string listID, string folderID)
        {
            try
            {
                var items = await _microsoft.Sites[ID].Lists[listID].Drive.Items[folderID].Children.Request().GetAsync();

                List<ItemModel> itemsModel = new();

                foreach (var item in items)
                {
                    itemsModel.Add(new()
                    {
                        ID = item.Id,
                        Name = item.Name,
                        WebUrl = item.WebUrl,
                    });
                }

                return itemsModel;
            }
            catch
            {
                return new();
            }
        }

        public async Task<List<ItemModel>> GetAll(string name, string ID, string listID, string fileID)
        {
            IDriveItemChildrenCollectionPage folderContents =
                await _microsoft.Sites[ID].Lists[listID].Drive.Items[fileID].Children.Request().GetAsync();

            List<ItemModel> items = new();

            foreach (var item in folderContents)
            {
                string folderName = $"{name}/";

                if (item.Folder != null)
                {
                    folderName += $"{item.Name}";

                    items.Add(new()
                    {
                        FolderID = item.Id,
                        Name = folderName,
                        WebUrl = item.WebUrl,
                    });
                    items.AddRange(await GetAll(folderName, ID, listID, item.Id));
                }
                else
                    items.Add(new()
                    {
                        ID = item.Id,
                        Name = $"{folderName}{item.Name}",
                        WebUrl = item.WebUrl,
                    });
            }

            return items;
        }

        public async Task SaveDelete(string ID, string listID, ItemModel item, bool overwrite)
        {
            // If Folder
            if (string.IsNullOrEmpty(item.ID))
            {
                await DeleteSubFolderEmpty(ID, listID, item.FolderID);
                return;
            }

			DriveItem files = await _microsoft.Sites[ID].Lists[listID].Drive.Items[item.ID].Request().GetAsync();
			string urldownload = files.AdditionalData["@microsoft.graph.downloadUrl"].ToString();

			//Stream file = await _microsoft.Sites[ID].Lists[listID].Drive.Items[item.ID].Content.Request().GetAsync();

            FileModel fileModel = new()
            {
                FileUrl = urldownload,
				FileLength=files.Size?? 0,
				Name = item.Name
            };

            await GraphProvider.FileStorage.AddFile(fileModel, overwrite);
                //await Delete(ID, listID, item.ID);
        }

        public async Task Delete(string ID, string listID, string itemID) =>
            await _microsoft.Sites[ID].Lists[listID].Drive.Items[itemID].Request().DeleteAsync();


        public async Task DeleteSubFolderEmpty(string ID, string listID, string folderID)
        {
            IDriveItemChildrenCollectionPage folderContents =
               await _microsoft.Sites[ID].Lists[listID].Drive.Items[folderID].Children.Request().GetAsync();

            if (folderContents.Count == 0)
            {
                await Delete(ID, listID, folderID);
            }

        }


    }
}
