using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.File
{
    public class BlobStorageSettings
    {
        public const string SectionName = "BlobStorageSettings";

        public string ConnectionString { get; set; }    
    }
}
