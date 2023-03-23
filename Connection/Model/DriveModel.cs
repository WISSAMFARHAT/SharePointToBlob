using Microsoft.Graph.Models;
using Newtonsoft.Json.Linq;
using System.Text.Json.Serialization;

namespace Connection.Model;
public class DriveModel
{

    [JsonPropertyName("@odata.context")]
    public string? OdataContext { get; set; }

    [JsonPropertyName("value")]
    public List<Values>? Value { get; set; }


    public class Values
    {
        [JsonPropertyName("@microsoft.graph.downloadUrl")]
        public string? DownloadUrl { get; set; }

        [JsonPropertyName("createdDateTime")]
        public DateTime? CreatedDateTime { get; set; }

        [JsonPropertyName("eTag")]
        public string? ETag { get; set; }

        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("lastModifiedDateTime")]
        public DateTime? LastModifiedDateTime { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("webUrl")]
        public string? WebUrl { get; set; }

        [JsonPropertyName("cTag")]
        public string? CTag { get; set; }

        [JsonPropertyName("size")]
        public long Size { get; set; }

        [JsonPropertyName("createdBy")]
        public CreatedBy? CreatedBy { get; set; }

        [JsonPropertyName("lastModifiedBy")]
        public LastModifiedBy? LastModifiedBy { get; set; }

        [JsonPropertyName("parentReference")]
        public ParentReference? ParentReference { get; set; }

        [JsonPropertyName("file")]
        public File? File { get; set; }

        [JsonPropertyName("folder")]
        public Folder? Folder { get; set; }
    }

    public class Folder
    {
        [JsonPropertyName("childCount")]
        public int ChildCount { get; set; } = 0;
    }

    public class CreatedBy
    {
        [JsonPropertyName("application")]
        public Application? Application { get; set; }

        [JsonPropertyName("user")]
        public User? User { get; set; }
    }

    public class Application
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("displayName")]
        public string? DisplayName { get; set; }
    }

    public class User
    {
        [JsonPropertyName("email")]
        public string? Email { get; set; }

        // Add other properties if needed
    }

    public class LastModifiedBy
    {
        [JsonPropertyName("application")]
        public Application? Application { get; set; }

        [JsonPropertyName("user")]
        public User? User { get; set; }
    }

    public class ParentReference
    {
        [JsonPropertyName("driveId")]
        public string? DriveId { get; set; }

        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("path")]
        public string? Path { get; set; }
    }

    public class File
    {
        [JsonPropertyName("mimeType")]
        public string? MimeType { get; set; }
    }

}