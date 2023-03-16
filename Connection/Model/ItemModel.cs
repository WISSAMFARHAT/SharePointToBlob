using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Connection.Model
{
    public class ItemModel
    {
        public string? ID { get; set; }
        public string? FolderID { get; set; }
        public string? Name { get; set; }
        public string? WebUrl { get; set; }
        public long? Size { get; set; } = 0;
        public int? Count { get; set; }
        public bool ShowDiv { get; set; } = false;
    
    }
}
