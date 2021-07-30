using PublicationActivity.Data.Models;
using System.Collections.Generic;

namespace PublicationActivity.Models.User
{
    public class PublicationPredefinedData
    {
        public List<PublicationType> PublicationTypes { get; set; }
        public List<PrimaryReferenceLocation> PrimaryReferenceLocations { get; set; }
        public List<SecondaryReferenceLocation> SecondaryReferenceLocations { get; set; }
    }
}
