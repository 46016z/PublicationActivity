using System.Collections.Generic;

namespace PublicationActivity.Models.Publication
{
    public class GenerateBibliographyDescriptionDto
    {
        public string OriginalTitle { get; set; }
        public string PublisherData { get; set; }
        public string Identifier { get; set; }
        public List<ContributorDto> Contributors { get; set; }
    }
}
