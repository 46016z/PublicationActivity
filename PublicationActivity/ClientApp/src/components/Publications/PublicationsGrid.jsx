import React, { Fragment, useEffect, useMemo, useState } from 'react';

import { Table, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { uiColors } from '../../common.config';
import { fullPublicationPropsMetadata } from '../../config/publicationConfig';
import notificationsService from '../../services/notificationsService';

import './PublicationsGrid.scss';

const mainColumnsConfiguration = [
    { name: 'publicationType' },
    { name: 'originalTitle' },
    { name: 'yearPublished' }];

const copyTextToClipboard = (text, t) => {
    navigator.clipboard.writeText(text);
    
    notificationsService.success({
        message: t('ui.textCopied'),
        duration: 1000
    });
};

const renderPublicationDetails = (publication, t, hasInMemoryData) => {
    const innerRowLabels = fullPublicationPropsMetadata
        .filter(p => !mainColumnsConfiguration.some(c => c.name === p.name) && (hasInMemoryData ? p.name !== 'bibliographyDescription' : true))
        .map(p => p.name);

    return (<Table>
        <tbody>
            {innerRowLabels.map((l, i) => (
                <tr key={i}>
                    <td key={`${i}-0`}><b>{t(`publication.fields.${l}`)}</b></td>
                    <td key={`${i}-1`} 
                        className={`detail-field-${l}`}
                        {...(l === 'bibliographyDescription' ? { onClick: () =>copyTextToClipboard(publication[l], t) } : {})}>{publication[l]}</td>
                </tr>
            ))}
        </tbody>
    </Table>);
};

const mapRowsData = publications => publications.map((p, i) => ({
    index: i,
    data: p,
    expanded: false
}));

const PublicationsGrid = ({ publications, enableValidation, validationResults, hasInMemoryData }) => {
    const { t } = useTranslation();

    const columns = useMemo(() => mainColumnsConfiguration, []);

    const [rows, setRows] = useState(mapRowsData(publications));

    useEffect(() => {
        setRows(mapRowsData(publications))
    }, [publications]);

    const rowProps = useMemo(() => {
        if (!enableValidation) {
            return {};
        }

        return rows.reduce((rowsProps, row) => {
            let rowProps = {};
            const validationResult = validationResults[row.index];

            if (enableValidation) {
                rowProps = {
                    style: {
                        backgroundColor: validationResult.validationErrors.length ? uiColors.error : uiColors.success
                    },
                    'data-tip': validationResult.validationErrors.map(e => e.message).join('\n')
                };
            }

            if (!validationResult.validationErrors.length && validationResult.entityExists) {
                rowProps = {
                    style: {
                        backgroundColor: uiColors.warning
                    },
                    'data-tip': t('publication.validation.alreadyExists')
                };
            }
                
            rowsProps[row.index] = rowProps;

            return rowsProps;
        }, {});

    }, [publications, enableValidation, validationResults]);

    const updateExpandedState = rowIndex => {
        const updatedRows = [...rows];
        updatedRows[rowIndex].expanded = !updatedRows[rowIndex].expanded;

        setRows(updatedRows)
    };

    return (
        <div style={{
            maxWidth: '100%',
            overflowX: 'auto'
        }}>
            <Table bordered>
                <thead>
                    <tr>
                        <th key={'default'}></th>
                        {columns.map((c, i) => (<th key={i}>{t(`publication.fields.${c.name}`)}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(r => (
                        <Fragment key={r.index}>
                            <tr
                                key={`${r.index}-1`}
                                {...rowProps[r.index]}
                            >
                                <td key={`${r.index}-btn`} scope="row"><Button onClick={() => updateExpandedState(r.index)}><FontAwesomeIcon icon={r.expanded ? faArrowDown : faArrowRight} /></Button></td>
                                {columns.map((c, ci) => (<td key={`${r.index}-${ci}`}>{r.data[c.name]}</td>))}
                            </tr>
                            {r.expanded ? (
                                <tr
                                    key={`${r.index}-2`}
                                    {...rowProps[r.index]}
                                >
                                    <td key={`${r.index}-detail`} colSpan={columns.length + 1}>
                                        {renderPublicationDetails(r.data, t, hasInMemoryData)}
                                    </td>
                                </tr>
                            ) : null}
                        </Fragment>
                    ))}
                </tbody>
            </Table>
        </div>

    );
};

export { PublicationsGrid };
