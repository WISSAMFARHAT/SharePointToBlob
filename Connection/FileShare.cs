using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Files.Shares;
using Connection.Model;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Formats.Asn1;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Connection
{
    public class FileShare
    {
        public HttpClient? HttpServer { get; set; }
        public ShareServiceClient ShareClient { get; set; }

        public ShareClient ShareContainerClient { get; set; }

        public ShareDirectoryClient DirectoryClient { get; set; }

        public FileShare(string connectionString)
        {

            ShareClient = new(connectionString);
            ShareContainerClient = ShareClient.GetShareClient("sharepoint");
            ShareContainerClient.CreateIfNotExists();
        }

        public async Task<bool> AddFile(FileModel file, bool overrideCheck)
        {
            try
            {
                string[] splitname = file.Name.Split("/");

                string parantfoldername = splitname[0];

                string[] folders = splitname.Take(splitname.Length - 1).ToArray();
                folders = folders.Skip(1).ToArray();

                string filename = splitname[splitname.Length - 1];

                ShareDirectoryClient parrantDirectory = ShareContainerClient.GetDirectoryClient(parantfoldername);
                parrantDirectory.CreateIfNotExists();

                foreach (string folder in folders)
                {
                    ShareDirectoryClient nextDirectory = parrantDirectory.GetSubdirectoryClient(folder);
                    nextDirectory.CreateIfNotExists();

                    parrantDirectory = nextDirectory;
                }

                await parrantDirectory.CreateIfNotExistsAsync();

                ShareFileClient fileClient = parrantDirectory.GetFileClient(filename);

                if (await fileClient.ExistsAsync())
                {
                    if (!overrideCheck)
                        return false;

                    await fileClient.DeleteAsync();
                }

                await fileClient.CreateAsync(file.File.Length);
                await fileClient.UploadAsync(file.File);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
