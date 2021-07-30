using System.Collections.Generic;

namespace PublicationActivity.Models.Publication
{
    public class PublicationDto
    {
        public string PublicationType { get; set; }
        public string OriginalTitle { get; set; }
        public int YearPublished { get; set; }
        public string PublisherData { get; set; }
        public string Identifier { get; set; }
        public string PrimaryReferenceLocation { get; set; }
        public string SecondaryReferenceLocation { get; set; }
        public string TertiaryReferenceLocation { get; set; }
        public List<ContributorDto> Contributors { get; set; }
        public string IsiImpactFactor { get; set; }
        public string SjrScopusImpactRank { get; set; }
        public string PublicationLanguageCode { get; set; }
        public string PublicationLink { get; set; }
        public string BibliographyDescription { get; set; }
    }
}
