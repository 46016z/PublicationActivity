using System.Collections.Generic;

namespace PublicationActivity.Data.Models
{
    public class SecondaryReferenceLocation
    {
        public SecondaryReferenceLocation()
        {
            this.Publications = new HashSet<Publication>();
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public ICollection<Publication> Publications { get; set; }
    }
}
