using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Photo
    {
        public int Id { get; set; }

        public string PhotoString { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
