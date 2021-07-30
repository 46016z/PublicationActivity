
import React from 'react';
import { Workbook } from "exceljs";
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { sheetConfig, sheetsService } from '../../services/sheetsService';
import { fullPublicationPropsMetadata } from '../../config/publicationConfig';
import notificationService from '../../services/notificationsService';

const getFileTimestamp = () => {
    const date = new Date();

    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
};

const PublicationsExporter = ({ publications }) => {
    const { t } = useTranslation();

    const exportHeaders = (workSheet) => {
        const row = workSheet.getRow(1);

        for (let i = 0; i < fullPublicationPropsMetadata.length; i += 1) {
            const prop = fullPublicationPropsMetadata[i];

            const cell = row.getCell((i + 1));
            cell.style = sheetConfig.getPrimaryHeaderCellStyles();
            if (prop.exportedColumnHeaderStyle) {
                Object.assign(cell.style, prop.exportedColumnHeaderStyle);
            }
            cell.value = t(`publication.fields.${prop.name}`);
        }
    }

    const exportCells = (workSheet) => {
        const skipRowsCount = 1;

        for (let i = 0; i < publications.length; i += 1) {
            const publication = publications[i];

            const row = workSheet.getRow((i + 1) + skipRowsCount);

            let cell;

            for (let j = 0; j < fullPublicationPropsMetadata.length; j += 1) {
                const prop = fullPublicationPropsMetadata[j];
                const propValue = publication[prop.name];

                cell = row.getCell((j + 1));
                cell.style = sheetConfig.getCellStyles();
                if (prop.exportedCellStyle) {
                    Object.assign(cell.style, prop.exportedCellStyle);
                }
                cell.value = propValue;
            }
        }
    }

    const exportMainWorkSheet = async (workbook) => {
        const workSheet = workbook.addWorksheet('Отчет публикации');

        applyColumnsWidth(workSheet);

        exportHeaders(workSheet);

        exportCells(workSheet);
    }

    const applyColumnsWidth = (workSheet) => {
        for (let i = 0; i < fullPublicationPropsMetadata.length; i += 1) {
            workSheet.getColumn(i + 1).width = fullPublicationPropsMetadata[i].exportedColumnWidth;
        }
    }

    const exportSpread = async () => {
        const workbook = new Workbook();

        await exportMainWorkSheet(workbook);

        const bytes = await sheetsService.exportDataToFile(workbook);
        const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        const timestamp = getFileTimestamp();

        link.href = window.URL.createObjectURL(blob);
        link.download = `Отчет_публикации_${timestamp}_.xlsx`;
        link.click();

        notificationService.success(t('ui.publicationExportSuccess'));
    }

    return (
        <Button
            disabled={!(publications && publications.length)} 
            color="primary"
            onClick={exportSpread}>
            {t('ui.export')}
        </Button>
    );
}

export default PublicationsExporter;