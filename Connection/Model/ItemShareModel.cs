using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Connection.Model;

public class ItemShareModel
{

    [JsonProperty("@odata.context")]
    public string odatacontext { get; set; }

    [JsonProperty("@microsoft.graph.downloadUrl")]
    public string microsoftgraphdownloadUrl { get; set; }
    public DateTime createdDateTime { get; set; }
    public string eTag { get; set; }
    public string id { get; set; }
    public DateTime lastModifiedDateTime { get; set; }
    public string name { get; set; }
    public string webUrl { get; set; }
    public string cTag { get; set; }
    public long size { get; set; }
    public CreatedBy createdBy { get; set; }
    public LastModifiedBy lastModifiedBy { get; set; }
    public ParentReference parentReference { get; set; }
    public File file { get; set; }
    public FileSystemInfo fileSystemInfo { get; set; }
    public Shared shared { get; set; }

    public Folder? folder { get; set; }


    public class Folder
    {
        public int childCount { get; set; }
    }

    public class Application
    {
        public string id { get; set; }
        public string displayName { get; set; }
    }

    public class CreatedBy
    {
        public Application application { get; set; }
        public User user { get; set; }
    }

    public class File
    {
        public string mimeType { get; set; }
        public Hashes hashes { get; set; }
    }

    public class FileSystemInfo
    {
        public DateTime createdDateTime { get; set; }
        public DateTime lastModifiedDateTime { get; set; }
    }

    public class Hashes
    {
        public string quickXorHash { get; set; }
    }

    public class LastModifiedBy
    {
        public Application application { get; set; }
        public User user { get; set; }
    }

    public class ParentReference
    {
        public string driveType { get; set; }
        public string driveId { get; set; }
        public string id { get; set; }
        public string path { get; set; }
    }



    public class Shared
    {
        public string scope { get; set; }
    }

    public class User
    {
        public string email { get; set; }
        public string id { get; set; }
        public string displayName { get; set; }
    }

}