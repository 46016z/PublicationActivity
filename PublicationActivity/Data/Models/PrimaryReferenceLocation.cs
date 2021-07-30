using System.Collections.Generic;

namespace PublicationActivity.Data.Models
{
    public class PrimaryReferenceLocation
    {
        public PrimaryReferenceLocation()
        {
            this.Publications = new HashSet<Publication>();
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public ICollection<Publication> Publications { get; set; }
    }
}
