using Azure;
using Azure.Core;
using Azure.Identity;
using Connection.Model;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Identity.Client;
using Microsoft.Kiota.Abstractions;
using Microsoft.Kiota.Abstractions.Authentication;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using static System.Formats.Asn1.AsnWriter;

namespace Connection
{
    public class SharePointGraph
    {
        private string[] scopes = new string[] { "https://graph.microsoft.com/.default" };

        private GraphServiceClient _microsoft;

        private string _token { get; set; }

        private async Task<HttpResponseMessage> GetData(string url)
        {
            using HttpClient client = new();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
            client.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue { NoCache = true, NoStore = true };

            return await client.GetAsync($"{url}?v={Guid.NewGuid()}");
        }

        private async Task<HttpResponseMessage> DeleteData(string url)
        {
            using HttpClient client = new();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
            client.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue { NoCache = true, NoStore = true };

            return await client.DeleteAsync(url);
        }

        private FileShare _FileShare { get; set; }

        public SharePointGraph(string appID, string tenantID, string appSecret, FileShare fileShare)
        {
            var options = new TokenCredentialOptions
            {
                AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
            };

            ClientSecretCredential authProvider = new(tenantID, appID, appSecret, options);

            _microsoft = new GraphServiceClient(authProvider, scopes);

            _token = authProvider.GetToken(new TokenRequestContext(scopes)).Token;



            _FileShare = fileShare;
        }

        public async Task<List<ItemModel>> GetAllSides()
        {
            try
            {
                Microsoft.Graph.Models.SiteCollectionResponse sites = await _microsoft.Sites.GetAsync();
                List<Microsoft.Graph.Models.Site> response = sites.Value.Where(x => x.WebUrl.Contains("/sites/")).ToList();

                List<ItemModel> sitesModel = new();

                foreach (var site in response)
                {
                    sitesModel.Add(new()
                    {
                        ID = site.Id,
                        Name = site.Name,
                        WebUrl = site.WebUrl,
                    });
                }

                return sitesModel.OrderBy(key => key.Name).ToList();
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
                ListCollectionResponse? lists = await _microsoft.Sites[ID].Lists.GetAsync();
                List<List> response = lists.Value.Where(x => !x.WebUrl.Contains("/Lists/")).ToList();

                List<ItemModel> listModel = new();

                foreach (List list in response)
                {

                    listModel.Add(new()
                    {
                        ID = list.Id,
                        Name = list.Name,
                        WebUrl = list.WebUrl,
                    });
                }

                return listModel.OrderBy(key => key.Name).ToList();
            }
            catch
            {
                return new();
            }
        }
        public async Task<List<ItemModel>> GetAllFolderList(string siteId, string listId)
        {
            try
            {

                HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/root/children");
                string responseContent = await responseMessage.Content.ReadAsStringAsync();
                DriveModel root = JsonConvert.DeserializeObject<DriveModel>(responseContent)!;

                List<ItemModel> itemsModel = new();

                foreach (DriveModel.Values item in root.Value)
                {
                    int count = 0;
                    if (item.Folder != null)
                        count = item.Folder.ChildCount;

                    itemsModel.Add(new()
                    {
                        ID = item.Id,
                        Name = item.Name,
                        WebUrl = item.WebUrl,
                        Size = item.Size,
                        Count = count,
                        ShowDiv = true,
                    });
                }

                return itemsModel.OrderBy(key => key.Name).ToList();
            }
            catch
            {
                return new();
            }
        }

        public async Task<List<ItemModel>> GetAllItemsFolder(string siteId, string listId, string folderID)
        {
            try
            {
                HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{folderID}')/children");
                string responseContent = await responseMessage.Content.ReadAsStringAsync();
                DriveModel root = JsonConvert.DeserializeObject<DriveModel>(responseContent)!;

                List<ItemModel> itemsModel = new();

                foreach (DriveModel.Values item in root.Value)
                {
                    int count = 0;

                    if (item.Folder != null)
                        count = item.Folder.ChildCount;

                    itemsModel.Add(new()
                    {
                        ID = item.Id,
                        Name = item.Name,
                        WebUrl = item.WebUrl,
                        Size = item.Size,
                        Count = count,
                        ShowDiv = true,
                    });
                }

                return itemsModel.OrderBy(key => key.Name).ToList();
            }
            catch
            {
                return new();
            }
        }

        public async Task<List<ItemModel>> GetAll(string name, string siteId, string listId, string fileId)
        {

            HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{fileId}')/children");
            string responseContent = await responseMessage.Content.ReadAsStringAsync();
            DriveModel root = JsonConvert.DeserializeObject<DriveModel>(responseContent)!;

            List<ItemModel> items = new();

            foreach (DriveModel.Values item in root.Value)
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

                    items.AddRange(await GetAll(folderName, siteId, listId, item.Id));
                }
                else
                    items.Add(new()
                    {
                        ID = item.Id,
                        Name = $"{folderName}{item.Name}",
                        WebUrl = item.WebUrl,
                    });
            }

            return items.OrderBy(key => key.Name).ToList();
        }

        public async Task<bool> SaveDelete(string siteId, string listId, ItemModel item, bool overwrite)
        {
            // If Folder
            if (string.IsNullOrEmpty(item.ID))
                return true;

            HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{item.ID}')");
            string responseContent = await responseMessage.Content.ReadAsStringAsync();
            ItemShareModel file = JsonConvert.DeserializeObject<ItemShareModel>(responseContent)!;

            FileModel fileModel = new()
            {
                FileUrl = file.microsoftgraphdownloadUrl,
                FileLength = file.size,
                Name = item.Name
            };

            if (await _FileShare.AddFile(fileModel, overwrite))
            {
                await Delete(siteId, listId, item.ID);
                return true;
            }

            return false;
        }

        public async Task<bool> DeleteSubFolderEmpty(string siteId, string listId, string folderId)
        {
            HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{folderId}')");
            string responseContent = await responseMessage.Content.ReadAsStringAsync();
            ItemShareModel root = JsonConvert.DeserializeObject<ItemShareModel>(responseContent)!;

            if (root.folder == null || root.folder.childCount > 0)
                return false;

            await Delete(siteId, listId, folderId);

            return true;
        }

        public async Task Delete(string siteId, string listId, string itemId)
            => await DeleteData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{itemId}')");
    }
}
