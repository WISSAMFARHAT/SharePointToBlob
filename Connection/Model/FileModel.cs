using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Connection.Model;
public class FileModel
{
    public string? FileUrl { get; set; }
    public long FileLength { get; set; } = 0;
    public string Name { get; set; }

}
