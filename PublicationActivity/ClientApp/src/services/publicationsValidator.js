import validator from 'validator';
import apiService from './apiService';

import { format } from '../utils';

const currentYear = new Date().getFullYear();

class PublicationsValidator {

    validatePublication(publication, predefinedData, t) {
        if (!publication) {
            return;
        }

        return this._validatePublication(publication, predefinedData, t);
    }

    async validatePublications(publications, predefinedData, t) {
        const validationResults = {};

        if (!publications || !publications.length) {
            return {};
        }

        for (let i = 0; i < publications.length; i += 1) {
            const result = {
                index: i,
                validationErrors: this._validatePublication(publications[i], predefinedData, t)
            };

            validationResults[i] = result;
        }

        const publicationsPresenceResult = await apiService.getPublicationsPresenceByTitle(publications.map(b => b.originalTitle));
        const processedResult = publicationsPresenceResult
            .reduce((items, result) => {
                items[result.title] = result.value;
                return items;
            }, {});

        for(const index in validationResults) {
            const validationResult = validationResults[index];
            validationResult.entityExists = processedResult[publications[validationResult.index].originalTitle];
        }

        return validationResults;
    }

    _validatePublication(publication, predefinedData, t) {
        const validationErrors = [];

        if (validator.isEmpty(publication.publicationType)) {
            validationErrors.push({ field: 'publicationType', message: this._getRequiredFieldValidationErrorMessage('publicationType', t) });
        } else {
            const type = predefinedData?.publicationTypes?.find(type => type.name === publication.publicationType);

            if (!type || !type.supported) {
                validationErrors.push({ field: 'publicationType', message: format(t('publication.validation.typeNotSupported'), publication.publicationType) })
            }
        }

        if (validator.isEmpty(publication.originalTitle)) {
            validationErrors.push({ field: 'originalTitle', message: this._getRequiredFieldValidationErrorMessage('originalTitle', t) });
        }

        if (validator.isEmpty(`${publication.yearPublished}`)) {
            validationErrors.push({ field: 'yearPublished', message: this._getRequiredFieldValidationErrorMessage('yearPublished', t) });
        }

        if (publication.yearPublished < 1970 || publication.yearPublished > currentYear) {
            validationErrors.push({ field: 'yearPublished', message: format(t('publication.validation.yearPublishedInvalidRange'), t(`publication.fields.yearPublished`), currentYear) });
        }

        if (validator.isEmpty(`${publication.publisherData}`)) {
            validationErrors.push({ field: 'publisherData', message: this._getRequiredFieldValidationErrorMessage('publisherData', t) });
        }

        if (validator.isEmpty(`${publication.authorsAndCoAuthors}`)) {
            validationErrors.push({ field: 'authorsAndCoAuthors', message: this._getRequiredFieldValidationErrorMessage('authorsAndCoAuthors', t) });
        }

        if (!this._isNamesFormattingCorrect(publication.authorsAndCoAuthors)) {
            validationErrors.push({ field: 'authorsAndCoAuthors', message: format(t('publication.validation.invalidNamesFormatting'), t(`publication.fields.authorsAndCoAuthors`)) });
        }

        if (!this._isNamesFormattingCorrect(publication.studentsAndDoctorants)) {
            validationErrors.push({ field: 'studentsAndDoctorants', message: format(t('publication.validation.invalidNamesFormatting'), t(`publication.fields.studentsAndDoctorants`)) });
        }

        if (validator.isEmpty(publication.publicationLanguageCode)) {
            validationErrors.push({ field: 'publicationLanguageCode', message: this._getRequiredFieldValidationErrorMessage('publicationLanguageCode', t) });
        }

        if (publication.publicationLanguageCode.length !== 2) {
            validationErrors.push({ field: 'publicationLanguageCode', message: format(t('publication.validation.publicationLanguageInvalidLength'), t(`publication.fields.publicationLanguageCode`))});
        }

        return validationErrors;
    }

    _getRequiredFieldValidationErrorMessage(fieldName, t) {
        return format(t('validation.required'), t(`publication.fields.${fieldName}`));
    }

    _isNamesFormattingCorrect(names) {
        if (!names) {
            return true;
        }

        try {
            return names.split(',').filter(n => n && n.trim()).every(n => {
                const [firstName, lastName] = n.trim().split(' ').map(fln => fln.trim());

                return !!(firstName && lastName);
            });
        } catch (err) {
            return false;
        }
    }
}

const publicationsValidator = new PublicationsValidator();
export default publicationsValidator;