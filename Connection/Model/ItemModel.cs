using Microsoft.Graph;
using System;
using System.Collections.Generic;
namespace Connection.Model;
public class ItemModel
{
    public string? ID { get; set; }
    public string? Name { get; set; }
    public string? WebUrl { get; set; }
    public long? Size { get; set; } = 0;
    public string? FolderID { get; set; }
    public int Count { get; set; } = 0;
    public bool ShowDiv { get; set; } = false;

}
