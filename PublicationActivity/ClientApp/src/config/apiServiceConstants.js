
const ApiBaseUrl = '/api';

export const ApiPaths = {
    GetUsersUrl: `${ApiBaseUrl}/administration/user/all`,
    RegisterUserUrl: `${ApiBaseUrl}/administration/user`,
    ResetUserPasswordUrl: `${ApiBaseUrl}/administration/resetPassword`,
    GetPublicationPredefinedDataUrl: `${ApiBaseUrl}/publications/predefinedData`,
    GetUserPublicationsUrl: `${ApiBaseUrl}/publications/my`,
    GetFilteredPublicationsUrl: `${ApiBaseUrl}/publications/filter`,
    GetPublicationsPresenceByTitlesUrl: `${ApiBaseUrl}/publications/exist/titles`,
    CreatePublicationUrl: `${ApiBaseUrl}/publications`,
    GenerateBibliographyDescriptionUrl: `${ApiBaseUrl}/publications/generateDescription`,
    ImportPublicationsUrl: `${ApiBaseUrl}/publications/import`
};
