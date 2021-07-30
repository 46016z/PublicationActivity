using PublicationActivity.Interfaces;
using PublicationActivity.Models.Publication;
using PublicationActivity.Models.User;
using PublicationActivity.Services.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PublicationActivity.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicationsController : Controller
    {
        private readonly IPublicationsService publicationsService;

        public PublicationsController(IPublicationsService publicationsService)
        {
            this.publicationsService = publicationsService;
        }

        [HttpGet("predefinedData")]
        [Authorize(PermissionsManager.ReadPublication)]
        public async Task<ActionResult<PublicationPredefinedData>> GetPredefinedData() => Ok(await this.publicationsService.GetPredefinedData());

        [HttpGet("my")]
        [Authorize(PermissionsManager.ReadPublication)]
        public async Task<ActionResult<IEnumerable<PublicationDto>>> GetUserPublications()
        {
            return await this.publicationsService.GetUserPublications();
        }

        [HttpPost("exist/titles")]
        [Authorize(PermissionsManager.ReadPublication)]
        public async Task<IEnumerable<PublicationPresenceDto>> GetPublicationsPresenceByTitles([FromBody] List<string> titles)
        {
            return await this.publicationsService.GetPublicationsPresenceByTitles(titles);
        }

        [HttpPost]
        [Authorize(PermissionsManager.CreatePublication)]
        public async Task<ActionResult<PublicationDto>> CreatePublication([FromBody] PublicationDto publication) => Ok(await this.publicationsService.CreatePublication(publication));

        /// <summary>
        /// This endpoint is using POST action instead of GET to avoid encoding and decoding the huge number of filters in the query
        /// </summary>
        [HttpPost("filter")]
        [Authorize(PermissionsManager.SearchPublication)]
        public async Task<ActionResult<IEnumerable<PublicationDto>>> GetFilteredPublications([FromBody] PublicationDto filterDto)
        {
            return await this.publicationsService.GetFilteredPublications(filterDto);
        }

        [HttpPost("generateDescription")]
        [Authorize(PermissionsManager.CreatePublication)]
        public ActionResult<BibliographyDescriptionDto> GenerateBibliographyDescription([FromBody] GenerateBibliographyDescriptionDto dto) => Ok(this.publicationsService.GenerateBibliographyDescription(dto));

        [HttpPost("import")]
        [Authorize(PermissionsManager.CreatePublication)]
        public async Task<ActionResult> ImportPublications([FromBody] List<PublicationDto> publications)
        {
            await this.publicationsService.ImportPublications(publications);

            return Ok();
        }
    }
}
