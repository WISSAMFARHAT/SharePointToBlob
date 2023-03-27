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

                // List<ItemModel> sitesModel = new();

                //foreach (var site in response)
                //{
                //    sitesModel.Add(new()
                //    {
                //        ID = site.Id,
                //        Name = site.Name,
                //        WebUrl = site.WebUrl,
                //    });
                //}

                return response.OrderBy(key => key.Name).ToList();

            }
            catch (Exception ex)
            {
                return new();
            }
        }

        public async Task<List<ItemModel>> GetAllFolder(string siteId, string listId, string folderID = null)
        {
            try
            {
                bool empty = true;
                List<ItemModel> itemsModel = new();

                if (string.IsNullOrEmpty(folderID))
                {
                    do
                    {
                        HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/root/children");
                        string responseContent = await responseMessage.Content.ReadAsStringAsync();
                        DriveModel root = JsonConvert.DeserializeObject<DriveModel>(responseContent)!;

                        if (root.Value != null)
                        {
                            empty = false;

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

                            await Task.Delay(1000);
                        }

                    } while (empty);

                }
                else
                {
                    do
                    {
                        HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{folderID}')/children");
                        string responseContent = await responseMessage.Content.ReadAsStringAsync();
                        DriveModel root = JsonConvert.DeserializeObject<DriveModel>(responseContent)!;

                        if (root.Value != null)
                        {
                            empty = false;

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

                            await Task.Delay(1000);
                        }

                    } while (empty);
                }

                return itemsModel.OrderBy(key => key.Name).ToList();

            }
            catch (Exception ex)
            {
                return new();
            }
        }

        public async Task<List<ItemModel>> GetAll(string name, string siteId, string listId, string fileId)
        {

            HttpResponseMessage responseMessage = await GetData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{fileId}')/children");
            string responseContent = await responseMessage.Content.ReadAsStringAsync();
            DriveModel root = JsonConvert.DeserializeObject<DriveModel>(responseContent)!;
            bool empty = true;
            List<ItemModel> items = new();
            do
            {
                if (root.Value != null)
                {
                    empty = false;

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
                                Size=item.Size
                            });
                    }
                }

            } while (empty);

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
        {
            HttpResponseMessage request = await DeleteData($"https://graph.microsoft.com/v1.0/sites('{siteId}')/lists('{listId}')/drive/items('{itemId}')");
            string responseContent = await request.Content.ReadAsStringAsync();
        }
    }
}
