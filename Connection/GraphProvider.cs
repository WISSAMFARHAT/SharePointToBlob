using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Connection
{
    public class GraphProvider
    {
        public static SharePointGraph ShareGraph { get; set; }
        public static BlobStorage Blobstroage { get; set; }
    }
}
