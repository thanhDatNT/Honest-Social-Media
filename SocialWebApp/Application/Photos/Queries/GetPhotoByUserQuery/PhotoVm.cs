using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Photos.Queries.GetPhotoByUserQuery
{
    public class PhotoVm
    {
        public List<PhotoDto> Photos { get; set; }  

        public int TotalCount { get; set; }

        public bool HasNextPage { get; set; }
    }
}
