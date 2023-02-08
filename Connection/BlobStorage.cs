using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
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
    public class BlobStorage
    {
        public HttpClient? HttpServer { get; set; }
        public BlobServiceClient BlobClient { get; set; }
        public BlobContainerClient AzureContainer { get; set; }

        public BlobStorage(string connectionString) 
        {
            BlobClient = new(connectionString);
            AzureContainer = BlobClient.GetBlobContainerClient("azre");
            AzureContainer.CreateIfNotExists();
        }

      

        public async Task<FileModel> AddFile(FileModel file)
        {
            try
            {
                await AzureContainer.UploadBlobAsync(file.Name, file.File);

                return file;

            }
            catch (Exception e)
            {
                return null;
            }


        }   



    }
}
