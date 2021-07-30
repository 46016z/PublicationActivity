using System.Collections.Generic;

namespace PublicationActivity.Data.Models
{
    public class Publication
    {
        public Publication()
        {
            this.ContributorPublications = new HashSet<ContributorPublication>();
        }

        public int Id { get; set; }
        public int PublicationTypeId { get; set; }
        public string UserId { get; set; }
        public string OriginalTitle { get; set; }
        public int YearPublished { get; set; }

        /* This might be a type if the separate data inside is needed (издание, брой/том, издателство, страници) */
        public string PublisherData { get; set; }

        /* ISBN/ISSN/DOI */
        public string Identifier { get; set; }

        /* This is set to be either "Web of science" or "Scopus". */
        public int? PrimaryReferenceLocationId { get; set; }
        public int? SecondaryReferenceLocationId { get; set; }
        public string TertiaryReferenceLocation { get; set; }
        public ICollection<ContributorPublication> ContributorPublications { get; set; }
        public string IsiImpactFactor { get; set; }
        public string SjrScopusImpactRank { get; set; }
        public string PublicationLanguageCode { get; set; }
        public string PublicationLink { get; set; }

        public PublicationType PublicationType { get; set; }
        public User User { get; set; }
        public PrimaryReferenceLocation PrimaryReferenceLocation { get; set; }
        public SecondaryReferenceLocation SecondaryReferenceLocation { get; set; }
    }
}
