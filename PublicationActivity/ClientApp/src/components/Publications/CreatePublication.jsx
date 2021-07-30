import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Subject } from 'rxjs';
import apiService from '../../services/apiService';
import notificationsService from '../../services/notificationsService';
import publicationsProcessor from '../../services/publicationsProcessor';
import { PublicationFields } from './PublicationFields';
import { defaultPublicationState } from '../../config/publicationConfig'; 
import { Prompt } from '../Prompt';

import './CreatePublication.scss';

const CreatePublication = () => {
    const { t } = useTranslation();

    const [publication, setPublication] = useState(defaultPublicationState);
    const [predefinedData, setPredefinedData] = useState();
    const [bibliographyDescription, setBibliographyDescription] = useState('');
    const [areFormFieldsValid, setAreFormFieldsValid] = useState(false);
    const [shouldRenderFormFields, setShouldRenderFormFields] = useState(false);
    const [isConfirmCreationModalVisible, setIsConfirmCreationModalVisible] = useState(false);
    const formatTextTimeout = useRef();

    const formSubmitted = useRef(new Subject());

    useEffect(() => {
        (async () => {
            setPredefinedData(await apiService.getPublicationPredefinedData());
            setShouldRenderFormFields(true);
        })();
    }, []);

    const updateBibliographyDescription = async (updatedPublication) => {
        try {
            const processedPublication = publicationsProcessor.processPublication(updatedPublication);
            const { text } = await apiService.generateBibliographyDescription(processedPublication);

            setBibliographyDescription(text);
        } catch (err) {
            const errorMessage = err.exceptionType ? t(err.exceptionType) : err.message;
            notificationsService.error(errorMessage);
        }
    };

    const createPublication = async () => {
        try {
            const processedPublication = publicationsProcessor.processPublication(publication);
            await apiService.createPublication(processedPublication);

            notificationsService.success(t('ui.addPublicationSuccess'));

            formSubmitted.current.next();
            setPublication(defaultPublicationState);
            setBibliographyDescription('');
        } catch (err) {
            const errorMessage = err.exceptionType ? t(err.exceptionType) : err.message;
            notificationsService.error(errorMessage);
        }
    };

    const triggerFormSubmit = async () => {
        try {
            const [{ value: exists }] = await apiService.getPublicationsPresenceByTitle([publication.originalTitle]);
            
            if (exists) {
                setIsConfirmCreationModalVisible(true);
            } else {
                await createPublication();
            }
        } catch (err) {
            const errorMessage = err.exceptionType ? t(err.exceptionType) : err.message;
            notificationsService.error(errorMessage);
        }
    };

    const confirmSubmitModalConfigration = useMemo(() => ({
        message: t('publication.modal.alreadyExists'),
        confirm: {
            label: t('ui.yes'),
            handler: async () => {
                await createPublication();
                setIsConfirmCreationModalVisible(false);
            }
        },
        decline: {
            label: t('ui.no'),
            handler: () => {
                setIsConfirmCreationModalVisible(false);
            }
        }
    }), [publication]);

    const onFieldUpdated = publication => {
        setPublication(publication);

        if (formatTextTimeout.current) {
            clearTimeout(formatTextTimeout.current);
        }

        formatTextTimeout.current = setTimeout(async () => {
            await updateBibliographyDescription(publication);
        }, 1000);
    };

    const copyTextToClipboard = () => {
        navigator.clipboard.writeText(bibliographyDescription);
        
        notificationsService.success({
            message: t('ui.textCopied'),
            duration: 1000
        });
    };

    const onFieldsValidated = areFieldsValid => setAreFormFieldsValid(areFieldsValid);

    return (
        <>
            <Row>
                <Col className={'mb-3'}>
                    <h2>{t('ui.createPublication')}</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        {shouldRenderFormFields && <PublicationFields
                            labelsTranslationPrefix={'publication.createFields'}
                            defaultPublicationState={defaultPublicationState}
                            formSubmitted={formSubmitted.current}
                            predefinedData={predefinedData}
                            enableValidation
                            onFieldUpdated={onFieldUpdated}
                            onFieldsValidated={onFieldsValidated} />}
                        <Row>
                            <Col className={'container'}>
                                {bibliographyDescription && <Alert color={'dark'} className={'publication-text-container'} onClick={copyTextToClipboard}>{bibliographyDescription}</Alert>}
                            </Col>
                        </Row>
                        <Button disabled={!areFormFieldsValid} onClick={() => triggerFormSubmit()}>{t('ui.addPublicationButton')}</Button>
                    </Form>
                </Col>
            </Row>
            <Prompt isOpen={isConfirmCreationModalVisible} configuration={confirmSubmitModalConfigration}  />
        </>
    );
};

export { CreatePublication };