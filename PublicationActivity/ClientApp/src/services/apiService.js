import { ApiPaths } from '../config/apiServiceConstants';
import { ErrorWithType } from '../customErrors/ErrorWithType';
import authService, { AuthenticationResultStatus } from './authorizeService';

const defaultErrorType = 'ExceptionType.Unknown';

class ApiService {

    async getPublicationPredefinedData() {
        return await this.getJson(ApiPaths.GetPublicationPredefinedDataUrl);
    }

    async getUserPublications() {
        return await this.getJson(ApiPaths.GetUserPublicationsUrl);
    }

    async getFilteredPublications(filters) {
        return await this.postJson(ApiPaths.GetFilteredPublicationsUrl, filters);
    }

    async getPublicationsPresenceByTitle(publicationsTitles) {
        return await this.postJson(ApiPaths.GetPublicationsPresenceByTitlesUrl, publicationsTitles);
    }

    async createPublication(publication) {
        return await this.postJson(ApiPaths.CreatePublicationUrl, publication);
    }

    async generateBibliographyDescription(publication) {
        return await this.postJson(ApiPaths.GenerateBibliographyDescriptionUrl, publication);
    }

    async importPublications(publications) {
        return await this.postJson(ApiPaths.ImportPublicationsUrl, publications);
    }

    async getAllUsers() {
        return await this.getJson(ApiPaths.GetUsersUrl);
    }

    async registerUser(user) {
        return await this.postJson(ApiPaths.RegisterUserUrl, user);
    }

    async resetUserPassword(userEmail) {
        return await this.postJson(ApiPaths.ResetUserPasswordUrl, userEmail);
    }

    async getJson(url, options) {
        const accessToken = await authService.getAccessToken();
        const executeRequest = async () => await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            },
            ...options
        });

        const response = await this.retryIfNotAuthenticated(executeRequest);

        const content = await response.text();
        const parsedContent = content ? JSON.parse(content) : {};

        if (!response.ok) {
            throw new ErrorWithType(parsedContent.ExceptionType || defaultErrorType);
        }

        return parsedContent;
    }

    async postJson(url, body, options) {
        const accessToken = await authService.getAccessToken();

        const executeRequest = async () => await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            },
            body: JSON.stringify(body),
            ...options
        });

        const response = await this.retryIfNotAuthenticated(executeRequest);

        const content = await response.text();
        const parsedContent = content ? JSON.parse(content) : {};

        if (!response.ok) {
            throw new ErrorWithType(parsedContent.ExceptionType || defaultErrorType);
        }

        return parsedContent;
    }

    async retryIfNotAuthenticated(executeRequest) {
        let response = await executeRequest();

        if (response.status === 401) {
            const returnUrl = window.location.href;
            const { status } = await authService.signIn({ returnUrl });

            if (status === AuthenticationResultStatus.Success) {
                window.location.replace(returnUrl);
            }

            response = await executeRequest();
        }

        return response;
    }
}

const apiService = new ApiService();

export default apiService;
