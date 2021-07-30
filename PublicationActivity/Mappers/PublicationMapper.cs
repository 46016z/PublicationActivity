using PublicationActivity.Data.Models;
using PublicationActivity.Models.Publication;
using System;
using System.Linq;

namespace PublicationActivity.Mappers
{
    public static class PublicationMapper
    {
        public static Publication ToEntity(this PublicationDto source)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));

            return new Publication
            {
                OriginalTitle = source.OriginalTitle,
                YearPublished = source.YearPublished,
                PublisherData = source.PublisherData,
                Identifier = source.Identifier,
                TertiaryReferenceLocation = source.TertiaryReferenceLocation,
                IsiImpactFactor = source.IsiImpactFactor,
                SjrScopusImpactRank = source.SjrScopusImpactRank,
                PublicationLanguageCode = source.PublicationLanguageCode,
                PublicationLink = source.PublicationLink
            };
        }

        public static PublicationDto FromEntity(this Publication source)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));

            return new PublicationDto
            {
                PublicationType = source.PublicationType?.Name,
                OriginalTitle = source.OriginalTitle,
                YearPublished = source.YearPublished,
                PublisherData = source.PublisherData,
                Identifier = source.Identifier,
                PrimaryReferenceLocation = source.PrimaryReferenceLocation?.Name,
                SecondaryReferenceLocation = source.SecondaryReferenceLocation?.Name,
                TertiaryReferenceLocation = source.TertiaryReferenceLocation,
                Contributors = source.ContributorPublications.Select(a => a.Contributor.FromEntity()).ToList(),
                IsiImpactFactor = source.IsiImpactFactor,
                SjrScopusImpactRank = source.SjrScopusImpactRank,
                PublicationLanguageCode = source.PublicationLanguageCode,
                PublicationLink = source.PublicationLink
            };
        }

        public static void Update(this Publication source, PublicationDto changes)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));

            if (changes == null)
                throw new ArgumentNullException(nameof(changes));

            source.YearPublished = changes.YearPublished;
            source.PublisherData = changes.PublisherData;
            source.Identifier = changes.Identifier;
            source.TertiaryReferenceLocation = changes.TertiaryReferenceLocation;
            source.IsiImpactFactor = changes.IsiImpactFactor;
            source.SjrScopusImpactRank = changes.SjrScopusImpactRank;
            source.PublicationLanguageCode = changes.PublicationLanguageCode;
            source.PublicationLink = changes.PublicationLink;
        }

        public static ContributorDto FromEntity(this Contributor contributor)
        {
            return new ContributorDto
            {
                FirstName = contributor.FirstName,
                LastName = contributor.LastName,
                IsStudentOrDoctorant = contributor.IsStudentOrDoctorant
            };
        }
    }
}
