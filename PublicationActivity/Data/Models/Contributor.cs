using System.Collections.Generic;

namespace PublicationActivity.Data.Models
{
    public class Contributor
    {
        public Contributor()
        {
            this.ContributorPublications = new HashSet<ContributorPublication>();
        }

        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public bool IsStudentOrDoctorant { get; set; }

        public ICollection<ContributorPublication> ContributorPublications { get; set; }
    }
}
