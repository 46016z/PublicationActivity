using PublicationActivity.Models.Publication;
using PublicationActivity.Models.User;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PublicationActivity.Interfaces
{
    public interface IPublicationsService
    {
        Task<PublicationPredefinedData> GetPredefinedData();

        BibliographyDescriptionDto GenerateBibliographyDescription(GenerateBibliographyDescriptionDto dto);

        Task<List<PublicationDto>> GetUserPublications();

        Task<IEnumerable<PublicationPresenceDto>> GetPublicationsPresenceByTitles(List<string> titles);

        Task<List<PublicationDto>> GetFilteredPublications(PublicationDto filterDto);

        Task<PublicationDto> CreatePublication(PublicationDto publication);

        Task ImportPublications(List<PublicationDto> publications);
    }
}
