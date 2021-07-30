import React, { useRef, useState } from 'react';

import { Button, Spinner } from 'reactstrap';

import { sheetsService } from '../../services/sheetsService';
import publicationsParser from '../../services/publicationsParser';
import { useTranslation } from 'react-i18next';

const PublicationsImporter = ({ onImport, className }) => {
    const { t } = useTranslation();
    
    const [isOperationInProgress, setIsOperationInProgress] = useState(false);
    const fileInputRef = useRef(null);

    const getFileData = (file) => {
        return new Promise(resolve => {
            const fileReader = new FileReader();
            const supportsBinary = typeof fileReader.readAsBinaryString !== 'undefined';

            fileReader.onloadend = ({ target }) => {
                let data = target.result;

                if (!supportsBinary) {
                    data = new Uint8Array(data);
                }

                resolve(data);
            };

            if (supportsBinary) {
                fileReader.readAsBinaryString(file);
            } else {
                fileReader.readAsArrayBuffer(file);
            }
        });
    };

    const onFileInputChange = async ({ target }) => {
        setIsOperationInProgress(true);

        if (!target.files || !target.files.length) {
            return;
        }

        const [file] = target.files;

        const fileData = await getFileData(file);
        const workbookForms = sheetsService.getSheetsFromData(fileData)
        const parsedData = publicationsParser.parseData(workbookForms.wb);

        try {
            await onImport(parsedData);
        } catch (err) { }

        setIsOperationInProgress(false);
    };

    return (
        <>
            <Button color={'primary'} disabled={isOperationInProgress} className={className} onClick={() => fileInputRef.current.click()}>{isOperationInProgress ? <Spinner type="grow" color="primary" size={'sm'} /> : t('ui.selectFile')}</Button>
            <input
                ref={fileInputRef}
                type={'file'}
                hidden={true}
                multiple={false}
                accept={'.xls,.xlsx,.ods'}
                onChange={onFileInputChange}
            />
        </>
    );
};

export { PublicationsImporter };
