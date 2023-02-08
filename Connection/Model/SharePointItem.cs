using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Connection.Model
{
    public class SharePointItem
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string FileRef { get; set; }
        public string FileLeafRef { get; set; }
        public FileSystemObjectType FileSystemObjectType { get; set; }
    }

    public enum FileSystemObjectType
    {
        File,
        Folder
    }
}
