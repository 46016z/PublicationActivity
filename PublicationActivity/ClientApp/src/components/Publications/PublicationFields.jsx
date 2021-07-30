import React, { useEffect, useRef, useState } from 'react';
import { FormGroup, Input, Label, FormFeedback, Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import publicationsValidator from '../../services/publicationsValidator';

const defaultValidationErrorsState = { initialState: true };
const currentYear = new Date().getFullYear();

const PublicationFields = ({ labelsTranslationPrefix, defaultPublicationState, predefinedData, formSubmitted, enableValidation, onFieldUpdated, onFieldsValidated }) => {
    const { t } = useTranslation();

    const [publication, setPublication] = useState(defaultPublicationState);
    const [validationErrors, setValidationErrors] = useState(defaultValidationErrorsState);
    const validationCallback = useRef();
    const formSubmittedSubscription = useRef();

    const formFieldsConfiguration = {
        publicationType: {
            type: 'select',
            identifier: 'publicationType',
            content: [<option key={0} value={defaultPublicationState.publicationType}>{t('ui.chooseOption')}</option>,
            ...predefinedData.publicationTypes.map(t => (<option key={t.id} value={t.name}>{t.name}</option>))],
        },
        originalTitle: { type: 'text', identifier: 'originalTitle' },
        yearPublished: {
            type: 'number',
            identifier: 'yearPublished',
            additionalAttributes: {
                min: 1970,
                max: currentYear
            }
        },
        publisherData: { type: 'text', identifier: 'publisherData' },
        identifier: { type: 'text', identifier: 'identifier' },
        primaryReferenceLocation: {
            type: 'select',
            identifier: 'primaryReferenceLocation',
            content: [<option key={0} value={defaultPublicationState.primaryReferenceLocation}>{t('ui.chooseOption')}</option>,
            ...predefinedData.primaryReferenceLocations.map(l => (<option key={l.id} value={l.name}>{l.name}</option>))],
        },
        secondaryReferenceLocation: {
            type: 'select',
            identifier: 'secondaryReferenceLocation',
            content: [<option key={0} value={defaultPublicationState.secondaryReferenceLocation}>{t('ui.chooseOption')}</option>,
            ...predefinedData.secondaryReferenceLocations.map(l => (<option key={l.id} value={l.name}>{l.name}</option>))]
        },
        tertiaryReferenceLocation: { type: 'text', identifier: 'tertiaryReferenceLocation' },
        authorsAndCoAuthors: { type: 'text', identifier: 'authorsAndCoAuthors' },
        studentsAndDoctorants: { type: 'text', identifier: 'studentsAndDoctorants' },
        isiImpactFactor: { type: 'text', identifier: 'isiImpactFactor' },
        sjrScopusImpactRank: { type: 'text', identifier: 'sjrScopusImpactRank' },
        publicationLanguageCode: {
            type: 'text',
            identifier: 'publicationLanguageCode',
            additionalAttributes: {
                maxLength: 2
            }
        },
        publicationLink: { type: 'text', identifier: 'publicationLink' }
    };

    const formLayoutConfiguration = [
        {
            cols: [formFieldsConfiguration.publicationType, formFieldsConfiguration.yearPublished],
            colProps: {
                sm: 12,
                md: 6
            }
        },
        {
            cols: [formFieldsConfiguration.originalTitle]
        },
        {
            cols: [formFieldsConfiguration.publisherData]
        },
        {
            cols: [formFieldsConfiguration.identifier, formFieldsConfiguration.publicationLanguageCode],
            colProps: {
                sm: 12,
                md: 6
            }
        },
        {
            cols: [formFieldsConfiguration.primaryReferenceLocation, formFieldsConfiguration.secondaryReferenceLocation, formFieldsConfiguration.tertiaryReferenceLocation],
            colProps: {
                sm: 12,
                md: 4
            }
        },
        {
            cols: [formFieldsConfiguration.authorsAndCoAuthors]
        },
        {
            cols: [formFieldsConfiguration.studentsAndDoctorants]
        },
        {
            cols: [formFieldsConfiguration.isiImpactFactor, formFieldsConfiguration.sjrScopusImpactRank],
            colProps: {
                sm: 12,
                md: 6
            }
        },
        {
            cols: [formFieldsConfiguration.publicationLink]
        }
    ];

    useEffect(() => {
        if (formSubmitted) {
            formSubmittedSubscription.current = formSubmitted.subscribe(() => setPublication(defaultPublicationState));
        }

        return () => {
            if (formSubmittedSubscription.current) {
                formSubmittedSubscription.current.unsubscribe();
            }

            if (validationCallback.current) {
                clearTimeout(validationCallback.current);
            }
        };
    }, []);

    const validatePublication = async (updatedPublication) => {
        const validationResult = await publicationsValidator.validatePublication(updatedPublication, predefinedData, t);
        const convertedResults = validationResult.reduce((prev, current) => {
            if (!prev[current.field]) {
                prev[current.field] = [];
            }

            prev[current.field].push(current.message);

            return prev;
        }, {});

        if (onFieldsValidated) {
            onFieldsValidated(!validationResult.length);
        }

        setValidationErrors(convertedResults);
    };

    const updatePublicationField = e => {
        const { name, value } = e.target;

        const updatedPublication = {
            ...publication,
            [name]: value
        };
        setPublication(updatedPublication);

        onFieldUpdated(updatedPublication);
        
        if (enableValidation) {
            if (validationCallback.current) {
                clearTimeout(validationCallback.current);
            }
    
            validationCallback.current = setTimeout(async () => {
                await validatePublication(updatedPublication);
            }, 1000);
        }
    };

    const renderFormField = f => (
        <FormGroup key={f.identifier}>
            <Label for={f.identifier}>{t(`${labelsTranslationPrefix}.${f.identifier}`)}</Label>
            {f.content ?
                <Input type={f.type}
                       name={f.identifier}
                       id={f.identifier}
                       invalid={enableValidation && !!validationErrors[f.identifier]}
                       {...(f.additionalAttributes || {})}
                       value={publication[f.identifier]}
                       onChange={updatePublicationField}>
                    {f.content}
                </Input> :
                <Input type={f.type}
                       name={f.identifier}
                       id={f.identifier}
                       invalid={enableValidation && !!validationErrors[f.identifier]}
                       {...(f.additionalAttributes || {})}
                       value={publication[f.identifier]}
                       onChange={updatePublicationField} />
            }
            {enableValidation && validationErrors[f.identifier] && <FormFeedback>{validationErrors[f.identifier].join('\n')}</FormFeedback>}
        </FormGroup>
    );

    return (
        <Row>
            <Col>
                {formLayoutConfiguration.map((r, ri) => (
                    <Row key={ri}>
                        {r.cols.map((f, fi) => (
                            <Col key={fi} {...(r.colProps ? r.colProps : {})}>
                                {renderFormField(f)}
                            </Col>
                        ))}
                    </Row>
                ))}
            </Col>
        </Row>
    );
};

export { PublicationFields };
