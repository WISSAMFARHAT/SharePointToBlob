using Azure;
using Azure.Core;
using Azure.Identity;
using Connection.Model;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Graph.Models.CallRecords;
using Microsoft.Graph.Models.TermStore;
using Microsoft.Identity.Client;
using Microsoft.Kiota.Abstractions;
using Microsoft.Kiota.Abstractions.Authentication;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using static System.Formats.Asn1.AsnWriter;

namespace Connection
{
    public class SharePointGraph
    {
        private readonly string[] scopes = new string[] { "https://graph.microsoft.com/.default" };
        private FileShare _FileShare { get; set; }
        private ClientSecretCredential AuthProvider { get; set; }

        private readonly GraphServiceClient _microsoft;

        private string Token => AuthProvider.GetToken(new TokenRequestContext(scopes)).Token;

        //private void RefreshToken()
        //{
        //    _token = AuthProvider.GetToken(new TokenRequestContext(scopes)).Token;
        //}

        private async Task<HttpResponseMessage> GetData(string url)
        {
            using HttpClient client = new();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
            client.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue { NoCache = true, NoStore = true };

            HttpResponseMessage responseMessage = await client.GetAsync($"{url}?v={Guid.NewGuid()}");

            return responseMessage;
        }

        private async Task<HttpResponseMessage> DeleteData(string url)
        {
            using HttpClient client = new();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Token);
            client.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue { NoCache = true, NoStore = true };

            HttpResponseMessage responseMessage = await client.DeleteAsync(url);

            return responseMessage;
        }


        public SharePointGraph(string appID, string tenantId, string appSecret, FileShare fileShare)
        {
            _FileShare = fileShare;

            TokenCredentialOptions options = new() { AuthorityHost = AzureAuthorityHosts.AzurePublicCloud };

            AuthProvider = new(tenantId, appID, appSecret, options);

            _microsoft = new GraphServiceClient(AuthProvider, scopes);
        }

        public async Task<List<ItemModel>> Fetch(string ID = null)
        {
            try
            {
                List<ItemModel> response = new();

                if (string.IsNullOrEmpty(ID))
                {
                    SiteCollectionResponse sites = await _microsoft.Sites.GetAsync();
                    response = sites.Value.Where(x => x.WebUrl.Contains("/sites/")).Select(x => new ItemModel
                    {
                        ID = x.Id,
                        Name = x.Name,
                        WebUrl = x.WebUrl
                    }).ToList(); ;
                }
                else
                {
                    ListCollectionResponse? lists = await _microsoft.Sites[ID].Lists.GetAsync();
                    response = lists.Value.Where(x => !x.WebUrl.Contains("/Lists/")).Select(x => new ItemModel
                    {
                        ID = x.Id,
                        Name = x.Name,
                        WebUrl = x.WebUrl
                    }).ToList(); ;
                }

                return response.OrderBy(key => key.Name).ToList();

            }
            catch (Exception ex)
            {
                return new();
            }
        }

        public async Task<List<ItemModel>?> GetAllFolder(string siteId, string listId, string folderID = null)
        {
            List<ItemModel> itemsModel = new();

            if (string.IsNullOrEmpty(folderID))
            {
                HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/root/children");
                string responseContent = await responseMessage.Content.ReadAsStringAsync();
                DriveModel root = JsonConvert.DeserializeObject<DriveModel>(responseContent)!;

                if (root.Value == null)
                    return null;

                foreach (DriveModel.Values item in root.Value.Where(key => key.Size > 0))
                    itemsModel.Add(new()
                    {
                        ID = item.Id,
                        Name = item.Name,
                        WebUrl = item.WebUrl,
                        Size = item.Size,
                        Count = item.Folder?.ChildCount ?? 0,
                        ShowDiv = true,
                    });
            }
            else
            {
                HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{folderID}')/children");
                string responseContent = await responseMessage.Content.ReadAsStringAsync();
                DriveModel root = JsonConvert.DeserializeObject<DriveModel>(responseContent)!;

                if (root.Value == null)
                    return null;

                foreach (DriveModel.Values item in root.Value.Where(key => key.Size > 0))
                    itemsModel.Add(new()
                    {
                        ID = item.Id,
                        Name = item.Name,
                        WebUrl = item.WebUrl,
                        Size = item.Size,
                        Count = item.Folder?.ChildCount ?? 0,
                        ShowDiv = true,
                    });
            }

            return itemsModel.OrderBy(key => key.Name).ToList();
        }

        public async Task<List<ItemModel>> GetAll(string name, string siteId, string listId, string fileId)
        {
            HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{fileId}')/children");
            string responseContent = await responseMessage.Content.ReadAsStringAsync();
            DriveModel root = JsonConvert.DeserializeObject<DriveModel>(responseContent)!;
            List<ItemModel> items = new();

            if (root.Value != null)
            {
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
                            Size = item.Size
                        });
                }
            }


            return items.OrderBy(key => key.Name).ToList();
        }

        public async Task<ResultModel> SaveDelete(string siteId, string listId, ItemModel item, bool overwrite)
        {
            try
            {

                // If Folder
                if (string.IsNullOrEmpty(item.ID))
                    return new()
                    {
                        Success = true,
                        Status = StatusModel.Skip
                    };

                HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{item.ID}')");
                string responseContent = await responseMessage.Content.ReadAsStringAsync();
                ItemShareModel file = JsonConvert.DeserializeObject<ItemShareModel>(responseContent)!;

                FileModel fileModel = new()
                {
                    FileUrl = file.microsoftgraphdownloadUrl,
                    FileLength = file.size,
                    Name = item.Name
                };

                ResultModel result = await _FileShare.AddFile(fileModel, overwrite);

                if (result.Success)
                {
                    int deleteTryCount = 3;

                    while (deleteTryCount >= 0)
                    {
                        deleteTryCount--;

                        bool isDeleted = await Delete(siteId, listId, item.ID);

                        if (isDeleted)
                            break;

                        await Task.Delay(TimeSpan.FromSeconds(1));
                    }

                    return new()
                    {
                        Success = true,
                        Status = StatusModel.Succeed
                    };
                }

                return result;

            }
            catch (Exception ex)
            {
                return new()
                {
                    Success = false,
                    Status = StatusModel.Failed,
                    Error = ex.ToString()
                };
            }
        }

        public async Task<bool> DeleteSubFolderEmpty(string siteId, string listId, string folderId)
        {
            try
            {
                HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{folderId}')");
                string responseContent = await responseMessage.Content.ReadAsStringAsync();
                ItemShareModel root = JsonConvert.DeserializeObject<ItemShareModel>(responseContent)!;

                if (root.folder == null || root.folder.childCount > 0)
                    return false;

                return await Delete(siteId, listId, folderId);
            }
            catch (Exception)
            {
                return true;
            }

        }

        public async Task<bool> Delete(string siteId, string listId, string itemId)
        {
            HttpResponseMessage request = await DeleteData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{itemId}')");

            return request.IsSuccessStatusCode;
        }
    }
}
