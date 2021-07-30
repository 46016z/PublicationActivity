import React, { useEffect, useState, useMemo } from 'react';

import { Button, Row, Col } from 'reactstrap';
import ReactTooltip from 'react-tooltip';
import { PublicationsImporter } from './PublicationsImporter';
import { useTranslation } from 'react-i18next';
import publicationsValidator from '../../services/publicationsValidator';
import apiService from '../../services/apiService';
import notificationsService from '../../services/notificationsService';
import publicationsProcessor from '../../services/publicationsProcessor';
import { PublicationsGrid } from './PublicationsGrid';
import { Prompt } from '../Prompt';

const ImportPublications = () => {
    const { t } = useTranslation();

    const [publications, setPublications] = useState([]);
    const [predefinedData, setPredefinedData] = useState();
    const [validationResults, setValidationResults] = useState({});
    const [canImport, setCanImport] = useState(false);
    const [isConfirmImportModalVisible, setIsConfirmImportModalVisible] = useState(false);

    useEffect(() => {
        (async () => {
            setPredefinedData(await apiService.getPublicationPredefinedData());
        })();
    }, []);

    const onFileImport = async importedPublications => {
        setPublications(importedPublications);

        const validationResults = await publicationsValidator.validatePublications(importedPublications, predefinedData, t);
        setValidationResults(validationResults);
        const arePublicationsValid = !Object.values(validationResults).some(r => r.validationErrors.length > 0);
        setCanImport(arePublicationsValid);

        ReactTooltip.rebuild();
    };

    const importPublications = async () => {
        try {
            const processedPublications = publicationsProcessor.processPublications(publications);
            await apiService.importPublications(processedPublications);

            notificationsService.success(t('ui.importSuccess'));

            setPublications([]);
            setCanImport(false);
        } catch (err) {
            const errorMessage = err.exceptionType ? t(err.exceptionType) : err.message;
            notificationsService.error(errorMessage);
        }
    };

    const confirmSubmitModalConfigration = useMemo(() => ({
        message: t('publication.modal.alreadyExistsImport'),
        confirm: {
            label: t('ui.yes'),
            handler: async () => {
                await importPublications();
                setIsConfirmImportModalVisible(false);
            }
        },
        decline: {
            label: t('ui.no'),
            handler: () => {
                setIsConfirmImportModalVisible(false);
            }
        }
    }), [publications]);

    const triggerImport = async () => {
        try {
            if (validationResults && Object.values(validationResults).some(r => r.entityExists)) {
                setIsConfirmImportModalVisible(true);
            } else {
                await importPublications();
            }
        } catch (err) {
            const errorMessage = err.exceptionType ? t(err.exceptionType) : err.message;
            notificationsService.error(errorMessage);
        }
    };

    return (
        <>
            <Row>
                <Col>
                    <h2 className={'mb-3'}>{t('ui.importPublications')}</h2>
                </Col>
            </Row>
            <Row>
                <Col className={'mb-3'}>
                    <PublicationsImporter className={'mr-2'} onImport={b => onFileImport(b)} />
                    <Button disabled={!canImport} onClick={() => triggerImport()}>{t('ui.importButton')}</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{
                        maxWidth: '100%',
                        overflowX: 'auto'
                    }}>
                        {(!!publications.length && !!Object.keys(validationResults).length) && <PublicationsGrid publications={publications} enableValidation={true} validationResults={validationResults} hasInMemoryData={true} />}
                    </div>
                </Col>
            </Row>
            <Prompt isOpen={isConfirmImportModalVisible} configuration={confirmSubmitModalConfigration} />
        </>
    );
};

export { ImportPublications };
