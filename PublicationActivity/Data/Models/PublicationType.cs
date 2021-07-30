
using System.Collections.Generic;

namespace PublicationActivity.Data.Models
{
    public class PublicationType
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool Supported { get; set; }

        public List<Publication> Publications { get; set; }
    }
}
