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

namespace Connection
{
    public class SharePointGraph
    {
        private static string AppId { get; set; }
        private static string TenantId { get; set; }
        private static string AppSecret { get; set; }

        private string[] scopes = new string[] { "https://graph.microsoft.com/.default" };
        private IConfidentialClientApplication App { get; set; }

        private static GraphServiceClient _microsoft;

        private static HttpClient httpClient = new();
        public SharePointGraph(string appId, string tenantId, string appSecret)
        {

            AppId = appId;
            TenantId = tenantId;
            AppSecret = appSecret;
            App = ConfidentialClientApplicationBuilder
                .Create(AppId)
                .WithTenantId(TenantId)
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

        }

        public async Task<List<ItemModel>> GetAllSides()
        {
            try
            {
                IGraphServiceSitesCollectionPage sites = await _microsoft.Sites.Request().GetAsync();
                List<ItemModel> sitesModel = new();

                foreach (Microsoft.Graph.Site? site in sites)
                {
                    sitesModel.Add(new()
                    {
                        Id = site.Id,
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
                ISiteListsCollectionPage lists = await _microsoft.Sites[ID].Lists.Request().GetAsync();
                List<ItemModel> listModel = new();

                foreach (var list in lists)
                {
                    listModel.Add(new()
                    {
                        Id = list.Id,
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
                        Id = item.Id,
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

        public async Task<List<ItemModel>> GetAllItemsFolder(string ID, string listID, string FolderID)
        {
            try
            {
                var items = await _microsoft.Sites[ID].Lists[listID].Drive.Items[FolderID].Children.Request().GetAsync();

                List<ItemModel> itemsModel = new();

                foreach (var item in items)
                {
                    itemsModel.Add(new()
                    {
                        Id = item.Id,
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

        public async Task<List<ItemModel>> GetAll(string name, string id, string listID, string folderId, string folderName = null)
        {
            var folderContents = await _microsoft.Sites[id].Lists[listID].Drive.Items[folderId].Children.Request().GetAsync();
            List<ItemModel> items = new();


            foreach (var item in folderContents)
            {
                string folder = $"{name}/";

                if (item.Folder != null)
                {
                    
                    if (string.IsNullOrEmpty(folderName))
                        folder += item.Name;
                    else
                        folder += $"{folderName}/{item.Name}";
                    items.Add(new()
                    {
                        FolderName = folder,
                        Items = await GetAll(id, listID, item.Id, folder)
                    });
                }
                else
                {
                    items.Add(new()
                    {
                        Id = item.Id,
                        Name = string.IsNullOrEmpty(folderName) ? $"{folder}/{item.Name}" : $"{folderName}/{item.Name}",
                        WebUrl = item.WebUrl,
                    });

                }
            }

            return items;
        }

        public async Task SaveToBlob(string id, string listID, ItemModel url)
        {
            try
            {
                if (url.Items != null)
                {
                    foreach (var item in url.Items)
                    {
                        await SaveToBlob(id, listID, item);
                    }
                }
                else
                {

                    Stream wordFile = await _microsoft.Sites[id].Lists[listID].Drive.Items[url.Id].Content.Request().GetAsync();

                    FileModel file = new()
                    {
                        File = wordFile,
                        Name = url.Name
                    };

                    await GraphProvider.Blobstroage.AddFile(file);
                }

            }

            catch (Exception ex)
            {

            }

        }
        public async Task DeleteToBlob(string id, string listID, ItemModel url)
        {
            try
            {
                if (url.Items != null)
                {
                    foreach (var item in url.Items)
                    {
                        await DeleteToBlob(id, listID, item);
                    }
                }
                else
                {

                    await _microsoft.Sites[id].Lists[listID].Drive.Items[url.Id].Request().DeleteAsync();

                }

            }

            catch (Exception ex)
            {

            }

        }


    }
}