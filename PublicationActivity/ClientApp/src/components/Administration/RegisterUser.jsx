import React, { useRef, useState } from 'react';
import { Form, FormGroup, Input, Label, Button, FormFeedback, Row, Col } from 'reactstrap';
import Role from '../../models/Role';
import apiService from '../../services/apiService';
import userValidator from '../../services/userValidator';
import { useTranslation } from 'react-i18next';
import notificationsService from '../../services/notificationsService';

const defaultUserState = {
    username: '',
    email: '',
    role: ''
};
const defaultValidationErrorsState = { initialState: true };

const RegisterUser = () => {
    const { t } = useTranslation();

    const [user, setUser] = useState(defaultUserState);
    const [validationErrors, setValidationErrors] = useState(defaultValidationErrorsState);
    const validationCallback = useRef();

    const formFieldsConfiguration = [
        { type: 'text', identifier: 'username' },
        { type: 'text', identifier: 'email' },
        {
            type: 'select',
            identifier: 'role',
            content: [<option key={0} value={defaultUserState.role} hidden>{t('ui.chooseOption')}</option>,
            Object.values(Role).map((r, i) => (<option key={i} value={r}>{r}</option>))],
        }
    ];

    const updateUserField = e => {
        const { name, value } = e.target;

        const updatedUser = {
            ...user,
            [name]: value
        };
        setUser(updatedUser);

        if (validationCallback.current) {
            clearTimeout(validationCallback.current);
        }

        validationCallback.current = setTimeout(async () => {
            const validationResult = userValidator.validateUser(updatedUser, t)
                .reduce((prev, current) => {
                    if (!prev[current.field]) {
                        prev[current.field] = [];
                    }

                    prev[current.field].push(current.message);

                    return prev;
                }, {});
            setValidationErrors(validationResult);
        }, 1000);
    };

    const registerUser = async () => {
        try {
            await apiService.registerUser(user);

            notificationsService.success(t('ui.userRegisteredSuccessfully'));

            setValidationErrors(defaultValidationErrorsState);
            setUser(defaultUserState);
        } catch (err) {
            const errorMessage = err.exceptionType ? t(err.exceptionType) : err.message;
            notificationsService.error(errorMessage);
        }
    };

    return (
        <>
            <Row>
                <Col className={'mb-3'}>
                    <h2>{t('ui.registerUsers')}</h2>
                </Col>
            </Row>
            <Row>
                <Col className={'mb-3'}>
                    <Form>
                        {formFieldsConfiguration.map(f => (
                            <FormGroup key={f.identifier}>
                                <Label for={f.identifier}>{t(`user.fields.${f.identifier}`)}</Label>
                                {f.content ?
                                    <Input type={f.type}
                                        name={f.identifier}
                                        id={f.identifier}
                                        invalid={!!validationErrors[f.identifier]}
                                        value={user[f.identifier]}
                                        onChange={updateUserField}>
                                        {f.content}
                                    </Input> :
                                    <Input type={f.type}
                                        name={f.identifier}
                                        id={f.identifier}
                                        invalid={!!validationErrors[f.identifier]}
                                        value={user[f.identifier]}
                                        onChange={updateUserField} />
                                }
                                {validationErrors[f.identifier] && <FormFeedback>{validationErrors[f.identifier].join('\n')}</FormFeedback>}
                            </FormGroup>
                        ))}
                        <Button disabled={validationErrors.initialState || !!(Object.keys(validationErrors).length)} onClick={() => registerUser()}>{t('ui.registerUser')}</Button>
                    </Form>
                </Col>
            </Row>
        </>

    );
};

export { RegisterUser };
