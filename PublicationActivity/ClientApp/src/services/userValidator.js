import validator from 'validator';

import { format } from '../utils';

class UserValidator {

    validateUser(user, t) {
        if (!user) {
            return;
        }

        const validationErrors = [];

        if (validator.isEmpty(user.username)) {
            validationErrors.push({ field: 'username', message: this._getRequiredFieldValidationErrorMessage('username', t) });
        }

        if (!validator.matches(user.username, /^[A-Za-z0-9]+$/)) {
            validationErrors.push({ field: 'username', message: format(t('validation.invalidUsername'), t('user.fields.username')) });
        }

        if (validator.isEmpty(user.email)) {
            validationErrors.push({ field: 'email', message: this._getRequiredFieldValidationErrorMessage('email', t) });
        }

        if (!validator.isEmail(user.email)) {
            validationErrors.push({ field: 'email', message: t('validation.invalidEmail') });
        }

        if (validator.isEmpty(user.role)) {
            validationErrors.push({ field: 'role', message: this._getRequiredFieldValidationErrorMessage('role', t) });
        }

        return validationErrors;
    }

    _getRequiredFieldValidationErrorMessage(fieldName, t) {
        return format(t('validation.required'), t(`user.fields.${fieldName}`));
    }
}

const userValidator = new UserValidator();
export default userValidator;