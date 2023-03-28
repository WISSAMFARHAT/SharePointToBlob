using Azure.Storage.Files.Shares;
using Azure.Storage.Files.Shares.Models;
using Connection.Model;

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

        public async Task<ResultModel> AddFile(FileModel file, bool overrideCheck)
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
                        return new()
                        {
                            Success = false,
                            Status=StatusModel.Skip,
                            Error= "override"
                        };

                    await fileClient.DeleteAsync();
                }

                await fileClient.CreateAsync(file.FileLength);
                var result = await fileClient.StartCopyAsync(new Uri(file.FileUrl));

                // Wait for the copy operation to complete
                ShareFileProperties destinationProperties;

                do
                {
                    destinationProperties = await fileClient.GetPropertiesAsync();
                    await Task.Delay(TimeSpan.FromSeconds(1));
                }
                while (destinationProperties.CopyStatus == CopyStatus.Pending);

                // Check if the copy operation succeeded or failed
                if (destinationProperties.CopyStatus != CopyStatus.Success)
                    return new()
                    {
                        Success=false,
                        Status=StatusModel.Failed,
                        Error = "Failed Task"
                    };

                return new()
                {
                    Success=true,
                    Status=StatusModel.Succeed,
                };

            }
            catch (Exception ex)
            {
                return new()
                {
                    Success = false,
                    Status = StatusModel.Failed,
                    Error = ex.Message
                };
            }
        }
    }
}
