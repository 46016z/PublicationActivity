import { read, utils } from 'xlsx';

const borderStyles = {
    top: { color: { argb: 'ff000000' }, style: 'thin' },
    left: { color: { argb: 'ffd9d9d9' }, style: 'thin' },
    right: { color: { argb: 'ffd9d9d9' }, style: 'thin' },
    bottom: { color: { argb: 'ff000000' }, style: 'thin' }
}

const font = {
    name: 'Calibri',
    family: 1,
    size: 10,
    bold: true
}

const alignment = {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true
}

class SheetsService {
    getSheetsFromData(data) {
        const inputDataEncoding = typeof data === Uint8Array ? 'array' : 'binary';
        const workBook = read(data, { type: inputDataEncoding });
        const result = {};

        for (const sheetName of workBook.SheetNames) {
            result[sheetName] = utils.sheet_to_json(workBook.Sheets[sheetName], { range: 0, header: 1 });
        }
        
        return { jsonArr: result, wb: workBook };
    }

    async exportDataToFile(workbook) {
        return new Uint8Array(await workbook.xlsx.writeBuffer({ useStyles: true }));
    }
}

class SheetConfig {
    getPrimaryHeaderCellStyles() {
        return {
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'ffd9d9d9'
                }
            },
            border: borderStyles,
            alignment: alignment,
            font: font
        }
    };

    getCellStyles() {
        return {
            alignment: {
                horizontal: 'left'
            }
        };
    }
}

const sheetConfig = new SheetConfig();
const sheetsService = new SheetsService();

export { sheetConfig, sheetsService };
