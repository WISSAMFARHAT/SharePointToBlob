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
    public string? DisplaySize
    {
        get
        {
            if (Size == 0)
                return "0 KB";
            else if (Size < 1024 * 1024)
                return $"({(Size / 1024.0)?.ToString("0.00")}) KB";
            else if (Size < 1024 * 1024 * 1024)
                return $"({(Size / ((1024.0 * 1024.0)))?.ToString("0.00")}) MB";
            else
                return $"({(Size / ((1024.0 * 1024.0 * 1024.0)))?.ToString("0.00")}) GB";
        }
    }
    public string? FolderID { get; set; }
    public int Count { get; set; } = 0;
    public bool ShowDiv { get; set; } = false;
    public bool IsDeleted { get; set; } = false;

}
