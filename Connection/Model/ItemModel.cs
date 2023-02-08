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
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? FolderName { get; set; }

        public string? WebUrl { get; set; }

        public List<ItemModel>? Items { get; set; }

    
    }
}
