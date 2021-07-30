using PublicationActivity.CustomExceptions;
using PublicationActivity.Data;
using PublicationActivity.Data.Models;
using PublicationActivity.Interfaces;
using PublicationActivity.Mappers;
using PublicationActivity.Models.Publication;
using PublicationActivity.Models.User;
using PublicationActivity.Validation;
using FluentValidation;
using FluentValidation.Results;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PublicationActivity.Services
{
    public class PublicationsService : IPublicationsService
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IIdentityProvider identityProvider;

        public PublicationsService(ApplicationDbContext dbContext, IIdentityProvider identityProvider)
        {
            this.dbContext = dbContext;
            this.identityProvider = identityProvider;
        }

        public async Task<List<PublicationDto>> GetUserPublications()
        {
            var currentUserId = identityProvider.GetUserInfo()?.UserId;
            List<PublicationDto> results = new List<PublicationDto>();

            if (currentUserId == null)
            {
                return results;
            }

            results = await this.GetPublicationsQuery()
                .Where(b => b.UserId == currentUserId)
                .Select(b => MapDatabaseEntity(b))
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<PublicationPresenceDto>> GetPublicationsPresenceByTitles(List<string> titles)
        {
            var currentUserId = identityProvider.GetUserInfo()?.UserId;
            var existingPublications = await this.dbContext.Publications
                .Where(b => b.UserId == currentUserId && titles.Contains(b.OriginalTitle))
                .ToListAsync();

            return titles
                .Select(t => new PublicationPresenceDto { Title = t, Value = existingPublications.Any(b => b.OriginalTitle == t) })
                .ToList();
        }

        public async Task<List<PublicationDto>> GetFilteredPublications(PublicationDto publicationDto)
        {
            IQueryable<Publication> publicationsQuery = this.GetPublicationsQuery();

            if (!string.IsNullOrEmpty(publicationDto.PublicationType))
            {
                publicationsQuery = publicationsQuery.Where(b => b.PublicationType.Name == publicationDto.PublicationType);
            }

            if (!string.IsNullOrEmpty(publicationDto.OriginalTitle))
            {
                publicationsQuery = publicationsQuery.Where(b => b.OriginalTitle.Contains(publicationDto.OriginalTitle));
            }

            if (publicationDto.YearPublished != 0)
            {
                publicationsQuery = publicationsQuery.Where(b => b.YearPublished == publicationDto.YearPublished);
            }

            if (!string.IsNullOrEmpty(publicationDto.PublisherData))
            {
                publicationsQuery = publicationsQuery.Where(b => b.PublisherData.Contains(publicationDto.PublisherData));
            }

            if (!string.IsNullOrEmpty(publicationDto.Identifier))
            {
                publicationsQuery = publicationsQuery.Where(b => b.Identifier.Contains(publicationDto.Identifier));
            }

            if (!string.IsNullOrEmpty(publicationDto.PrimaryReferenceLocation))
            {
                publicationsQuery = publicationsQuery.Where(b => b.PrimaryReferenceLocation.Name == publicationDto.PrimaryReferenceLocation);
            }

            if (!string.IsNullOrEmpty(publicationDto.SecondaryReferenceLocation))
            {
                publicationsQuery = publicationsQuery.Where(b => b.SecondaryReferenceLocation.Name == publicationDto.SecondaryReferenceLocation);
            }

            if (!string.IsNullOrEmpty(publicationDto.TertiaryReferenceLocation))
            {
                publicationsQuery = publicationsQuery.Where(b => b.TertiaryReferenceLocation == publicationDto.TertiaryReferenceLocation);
            }

            if (publicationDto.Contributors != null && publicationDto.Contributors.Any())
            {
                var contributorsPredicate = PredicateBuilder.New<Publication>();

                foreach (var contributor in publicationDto.Contributors)
                {
                    contributorsPredicate = contributorsPredicate.Or(a =>
                        a.ContributorPublications.Any(da =>
                            da.Contributor.FirstName == contributor.FirstName &&
                            da.Contributor.LastName == contributor.LastName &&
                            da.Contributor.IsStudentOrDoctorant == contributor.IsStudentOrDoctorant));
                }

                publicationsQuery = publicationsQuery.Where(contributorsPredicate);
            }

            if (!string.IsNullOrEmpty(publicationDto.IsiImpactFactor))
            {
                publicationsQuery = publicationsQuery.Where(b => b.IsiImpactFactor == publicationDto.IsiImpactFactor);
            }

            if (!string.IsNullOrEmpty(publicationDto.SjrScopusImpactRank))
            {
                publicationsQuery = publicationsQuery.Where(b => b.SjrScopusImpactRank == publicationDto.SjrScopusImpactRank);
            }

            if (!string.IsNullOrEmpty(publicationDto.PublicationLanguageCode))
            {
                publicationsQuery = publicationsQuery.Where(b => b.PublicationLanguageCode == publicationDto.PublicationLanguageCode);
            }

            if (!string.IsNullOrEmpty(publicationDto.PublicationLink))
            {
                publicationsQuery = publicationsQuery.Where(b => b.PublicationLink.Contains(publicationDto.PublicationLink));
            }

            return await publicationsQuery
                .Select(b => MapDatabaseEntity(b))
                .ToListAsync();
        }

        public async Task<PublicationPredefinedData> GetPredefinedData()
        {
            var publicationTypes = await this.dbContext.PublicationTypes.ToListAsync();
            var primaryReferenceLocations = await this.dbContext.PrimaryReferenceLocations.ToListAsync();
            var secondaryReferenceLocations = await this.dbContext.SecondaryReferenceLocations.ToListAsync();

            return new PublicationPredefinedData
            {
                PublicationTypes = publicationTypes,
                PrimaryReferenceLocations = primaryReferenceLocations,
                SecondaryReferenceLocations = secondaryReferenceLocations
            };
        }

        public async Task<PublicationDto> CreatePublication(PublicationDto publication)
        {
            publication.ValidateAndThrow();

            var dbPublicationType = await this.dbContext.PublicationTypes
                .FirstOrDefaultAsync(t => t.Name == publication.PublicationType);

            if (dbPublicationType == null)
            {
                throw new ExceptionWithType(ExceptionType.EntityNotFound, publication.PublicationType);
            } 
            else if (!dbPublicationType.Supported)
            {
                throw new ExceptionWithType(ExceptionType.UnsupportedPublicationType, publication.PublicationType);
            }

            PrimaryReferenceLocation primaryReferenceLocation = null;

            if (!string.IsNullOrEmpty(publication.PrimaryReferenceLocation))
            {
                primaryReferenceLocation = await this.dbContext.PrimaryReferenceLocations
                    .FirstOrDefaultAsync(t => t.Name == publication.PrimaryReferenceLocation);

                if (primaryReferenceLocation == null)
                {
                    throw new ExceptionWithType(ExceptionType.EntityNotFound, publication.PrimaryReferenceLocation);
                }
            }

            SecondaryReferenceLocation secondaryReferenceLocation = null;

            if (!string.IsNullOrEmpty(publication.SecondaryReferenceLocation))
            {
                secondaryReferenceLocation = await this.dbContext.SecondaryReferenceLocations
                    .FirstOrDefaultAsync(t => t.Name == publication.SecondaryReferenceLocation);

                if (secondaryReferenceLocation == null)
                {
                    throw new ExceptionWithType(ExceptionType.EntityNotFound, publication.SecondaryReferenceLocation);
                }
            }

            var currentUserId = identityProvider.GetUserInfo()?.UserId;

            var existingPublication = await this.dbContext.Publications
                .Include(p => p.ContributorPublications)
                    .ThenInclude(cp => cp.Contributor)
                .Where(b => b.OriginalTitle == publication.OriginalTitle && !string.IsNullOrEmpty(b.UserId) && b.UserId == currentUserId)
                .FirstOrDefaultAsync();

            var dbPublication = existingPublication ?? publication.ToEntity();

            dbPublication.UserId = currentUserId;
            dbPublication.PublicationType = dbPublicationType;
            dbPublication.PrimaryReferenceLocation = primaryReferenceLocation;
            dbPublication.SecondaryReferenceLocation = secondaryReferenceLocation;

            await this.UpdateContributors(new List<(Publication, PublicationDto)> { (dbPublication, publication) });

            if (existingPublication == null)
            {
                this.dbContext.Publications.Add(dbPublication);
            }
            else
            {
                existingPublication.Update(publication);
            }

            await this.dbContext.SaveChangesAsync();

            return dbPublication.FromEntity();
        }

        public async Task ImportPublications(List<PublicationDto> publications)
        {
            var validationResults = new List<ValidationResult>();

            foreach (var publication in publications)
            {
                validationResults.Add(await publication.Validate());
            }

            var invalidPublications = validationResults.Where(r => !r.IsValid).ToList();

            if (invalidPublications.Any())
            {
                throw new ExceptionWithType(ExceptionType.ValidationFailed, string.Join(Environment.NewLine, invalidPublications.SelectMany(r => r.Errors).Select(e => e.ErrorMessage)));
            }

            var dbPublicationTypes = await this.dbContext.PublicationTypes
                .ToDictionaryAsync(kvp => kvp.Name, kvp => kvp);
            var missingPublicationTypes = publications
                .Where(b => !dbPublicationTypes.ContainsKey(b.PublicationType))
                .ToList();
            if (missingPublicationTypes.Any())
            {
                throw new ExceptionWithType(ExceptionType.EntityNotFound, string.Join(", ", missingPublicationTypes.Select(t => t.PublicationType)));
            }

            var unsupportedPublicationTypes = publications
                .Where(b => !dbPublicationTypes[b.PublicationType].Supported)
                .ToList();

            if (unsupportedPublicationTypes.Any())
            {
                throw new ExceptionWithType(ExceptionType.UnsupportedPublicationType, string.Join(", ", unsupportedPublicationTypes.Select(t => t.PublicationType)));
            }

            var dbPrimaryReferenceLocations = await this.dbContext.PrimaryReferenceLocations
                .ToDictionaryAsync(kvp => kvp.Name, kvp => kvp.Id);
            var invalidPrimaryReferenceLocations = publications
                .Where(b => !string.IsNullOrEmpty(b.PrimaryReferenceLocation) && !dbPrimaryReferenceLocations.ContainsKey(b.PrimaryReferenceLocation))
                .ToList();
            if (invalidPrimaryReferenceLocations.Any())
            {
                throw new ExceptionWithType(ExceptionType.EntityNotFound, string.Join(", ", invalidPrimaryReferenceLocations.Select(t => t.PrimaryReferenceLocation)));
            }

            var dbSecondaryReferenceLocations = await this.dbContext.SecondaryReferenceLocations
                .ToDictionaryAsync(kvp => kvp.Name, kvp => kvp.Id);
            var invalidSecondaryReferenceLocations = publications
                .Where(b => !string.IsNullOrEmpty(b.SecondaryReferenceLocation) && !dbSecondaryReferenceLocations.ContainsKey(b.SecondaryReferenceLocation))
                .ToList();
            if (invalidSecondaryReferenceLocations.Any())
            {
                throw new ExceptionWithType(ExceptionType.EntityNotFound, string.Join(", ", invalidSecondaryReferenceLocations.Select(t => t.SecondaryReferenceLocation)));
            }

            var currentUserId = identityProvider.GetUserInfo()?.UserId;

            var publicationsToAddToDto = new List<(Publication, PublicationDto)>();
            var publicationsToUpdateToDto = new List<(Publication, PublicationDto)>();
            var existingPublications = await this.GetExistingPublications(currentUserId, publications);

            foreach (var publication in publications)
            {
                var isExistingPublication = existingPublications.ContainsKey(publication.OriginalTitle);
                var targetPublication = isExistingPublication ?
                    existingPublications[publication.OriginalTitle] :
                    publication.ToEntity();

                targetPublication.UserId = currentUserId;
                targetPublication.PublicationType = dbPublicationTypes[publication.PublicationType];

                if (!string.IsNullOrEmpty(publication.PrimaryReferenceLocation))
                {
                    targetPublication.PrimaryReferenceLocationId = dbPrimaryReferenceLocations[publication.PrimaryReferenceLocation];
                }

                if (!string.IsNullOrEmpty(publication.SecondaryReferenceLocation))
                {
                    targetPublication.SecondaryReferenceLocationId = dbSecondaryReferenceLocations[publication.SecondaryReferenceLocation];
                }

                if (isExistingPublication)
                {
                    targetPublication.Update(publication);
                    publicationsToUpdateToDto.Add((targetPublication, publication));
                }
                else
                {
                    publicationsToAddToDto.Add((targetPublication, publication));
                }
            }

            await this.UpdateContributors(publicationsToAddToDto);
            await this.UpdateContributors(publicationsToUpdateToDto);

            if (publicationsToAddToDto.Any())
            {
                this.dbContext.Publications.AddRange(publicationsToAddToDto.Select(p => p.Item1));
            }

            await this.dbContext.SaveChangesAsync();
        }

        public BibliographyDescriptionDto GenerateBibliographyDescription(GenerateBibliographyDescriptionDto dto)
        {
            string formattedText = GenerateBibliographyDescription(
                dto.Contributors?.Select(a => (a.FirstName, a.LastName, a.IsStudentOrDoctorant, a.Order)).ToList(),
                dto.OriginalTitle,
                dto.PublisherData,
                dto.Identifier);

            return new BibliographyDescriptionDto { Text = formattedText };
        }

        private static string GenerateBibliographyDescription(
            List<(string FirstName, string LastName, bool IsStudentOrDoctorant, int Order)> contributors,
            string originalTitle,
            string publisherData,
            string identifier)
        {
            var authorsAndCoAuthors = contributors?.Where(c => !c.IsStudentOrDoctorant).OrderBy(c => c.Order).ToList();
            var studentsAndDoctorants = contributors?.Where(c => c.IsStudentOrDoctorant).OrderBy(c => c.Order).ToList();

            var contributorNames = FormatContributorNames(authorsAndCoAuthors, studentsAndDoctorants);

            var parts = new List<string> { contributorNames, originalTitle, publisherData, identifier };
            var nonEmptyParts = parts.Where(p => !string.IsNullOrEmpty(p));

            return nonEmptyParts.Any() ? $"{string.Join(". ", nonEmptyParts)}." : string.Join(". ", nonEmptyParts);
        }

        private IQueryable<Publication> GetPublicationsQuery()
        {
            return this.dbContext.Publications
                .Include(b => b.PublicationType)
                .Include(b => b.PrimaryReferenceLocation)
                .Include(b => b.SecondaryReferenceLocation)
                .Include(b => b.ContributorPublications.OrderBy(cp => cp.Order))
                    .ThenInclude(cp => cp.Contributor);
        }

        private static string FormatContributorNames(
            List<(string FirstName, string LastName, bool IsStudentOrDoctorant, int Order)> authorsAndCoAuthors,
            List<(string FirstName, string LastName, bool IsStudentOrDoctorant, int Order)> studentsAndDoctorants)
        {
            var result = new List<string>();

            if (authorsAndCoAuthors != null && authorsAndCoAuthors.Any())
            {
                result.Add($"{authorsAndCoAuthors[0].LastName} {authorsAndCoAuthors[0].FirstName}");
                result.AddRange(authorsAndCoAuthors.Skip(1).Select(c => $"{c.FirstName} {c.LastName}"));
            }

            if (studentsAndDoctorants != null && studentsAndDoctorants.Any())
            {
                result.AddRange(studentsAndDoctorants.Select(c => $"{c.FirstName} {c.LastName}"));
            }

            return string.Join(", ", result);
        }

        private async Task<Dictionary<string, Publication>> GetExistingPublications(string userId, List<PublicationDto> publicationDtos)
        {
            var publicationsPredicate = PredicateBuilder.New<Publication>();

            foreach (var publication in publicationDtos)
            {
                publicationsPredicate = publicationsPredicate.Or(b => b.OriginalTitle == publication.OriginalTitle && !string.IsNullOrEmpty(b.UserId) && b.UserId == userId);
            }

            return await this.dbContext.Publications
                .Where(publicationsPredicate)
                .Include(b => b.ContributorPublications.OrderBy(cp => cp.Order))
                    .ThenInclude(cp => cp.Contributor)
                .ToDictionaryAsync(kvp => kvp.OriginalTitle, kvp => kvp);
        }

        private async Task UpdateContributors(List<(Publication, PublicationDto)> publications)
        {
            var dtoContributors = publications
                .SelectMany(p => p.Item2.Contributors?.Select(c => new
                {
                    c.FirstName,
                    c.LastName,
                    c.IsStudentOrDoctorant,
                    c.Order,
                    PublicationId = p.Item1.Id
                }))
                .GroupBy(c => new
                {
                    c.FirstName,
                    c.LastName,
                    c.IsStudentOrDoctorant,
                    c.PublicationId
                })
                .Select(g => g.First())
                .ToList();

            var contributorsPredicate = PredicateBuilder.New<ContributorPublication>();
            foreach (var contributor in dtoContributors)
            {
                contributorsPredicate =
                    contributorsPredicate.Or(c => c.Contributor.FirstName == contributor.FirstName &&
                                             c.Contributor.LastName == contributor.LastName &&
                                             c.Contributor.IsStudentOrDoctorant == contributor.IsStudentOrDoctorant &&
                                             c.PublicationId == contributor.PublicationId);
            }

            var existingContributors = await this.dbContext.ContributorPublications
                .Include(c => c.Contributor)
                .Include(c => c.Publication)
                .Where(contributorsPredicate)
                .ToDictionaryAsync(kvp => $"{kvp.Contributor.FirstName}_{kvp.Contributor.LastName}_{kvp.Contributor.IsStudentOrDoctorant}_{kvp.PublicationId}", kvp => kvp);

            foreach (var (publication, dto) in publications)
            {
                this.RemoveContributors(publication, dto);

                if (dto.Contributors != null)
                {
                    foreach (var contributor in dto.Contributors)
                    {
                        var key = $"{contributor.FirstName}_{contributor.LastName}_{contributor.IsStudentOrDoctorant}_{publication.Id}";

                        if (!existingContributors.ContainsKey(key))
                        {
                            var newContributor = new Contributor
                            {
                                FirstName = contributor.FirstName,
                                LastName = contributor.LastName,
                                IsStudentOrDoctorant = contributor.IsStudentOrDoctorant
                            };

                            existingContributors.Add(key, new ContributorPublication
                            {
                                Order = contributor.Order,
                                Contributor = newContributor,
                                Publication = publication
                            });
                        }

                        var existingContributor = existingContributors[key];
                        if (existingContributor.Order != contributor.Order)
                        {
                            existingContributor.Order = contributor.Order;
                        }

                        publication.ContributorPublications.Add(existingContributors[key]);
                    }
                }
            }
        }

        private void RemoveContributors(Publication publication, PublicationDto publicationDto)
        {
            var dtoContributors = publicationDto.Contributors ?? new List<ContributorDto>();
            var contributorsToRemove = publication.ContributorPublications
                .Where(c => !dtoContributors.Any(cd => c.Contributor.FirstName == cd.FirstName &&
                    c.Contributor.LastName == cd.LastName &&
                    c.Contributor.IsStudentOrDoctorant == cd.IsStudentOrDoctorant))
                .ToList();

            foreach (var contributor in contributorsToRemove)
            {
                publication.ContributorPublications.Remove(contributor);
            }
        }

        private static PublicationDto MapDatabaseEntity(Publication publication)
        {
            var dto = publication.FromEntity();

            dto.BibliographyDescription = GenerateBibliographyDescription(
                                publication.ContributorPublications.Select(a => (a.Contributor.FirstName, a.Contributor.LastName, a.Contributor.IsStudentOrDoctorant, a.Order)).ToList(),
                                publication.OriginalTitle,
                                publication.PublisherData,
                                publication.Identifier);

            return dto;
        }
    }
}
