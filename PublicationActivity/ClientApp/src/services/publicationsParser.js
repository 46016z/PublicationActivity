const toString = value => {
    if (!value) {
        return value;
    }

    return value.toString();
};

class PublicationsParser {

    parseData(workBook) {
        const publications = [];

        const sheet = workBook.Sheets['2.1 Публикации НЕподадени в НАЦ'];

        let line = 2;
        while(true) {
            const publication = {};

            publication.publicationType = toString(this._getCellValue(sheet[`B${line}`]));

            if (!publication.publicationType) {
                break;
            }

            publication.originalTitle = toString(this._getCellValue(sheet[`C${line}`]));
            publication.yearPublished = this._getCellValue(sheet[`D${line}`]);
            publication.publisherData = this._getCellValue(sheet[`E${line}`]);
            publication.identifier = this._getCellValue(sheet[`F${line}`]);
            publication.primaryReferenceLocation = this._getCellValue(sheet[`G${line}`]);
            publication.secondaryReferenceLocation = this._getCellValue(sheet[`H${line}`]);
            publication.tertiaryReferenceLocation = this._getCellValue(sheet[`I${line}`]);
            publication.authorsAndCoAuthors = this._getCellValue(sheet[`J${line}`]);
            publication.studentsAndDoctorants = this._getCellValue(sheet[`K${line}`]);
            publication.isiImpactFactor = this._getCellValue(sheet[`L${line}`]);
            publication.sjrScopusImpactRank = this._getCellValue(sheet[`M${line}`]);
            publication.publicationLanguageCode = this._getCellValue(sheet[`N${line}`]);
            publication.publicationLink = this._getCellValue(sheet[`O${line}`]);

            publications.push(publication);

            line += 1;
        }

        return publications;
    }

    _getCellValue(cell) {
        let value = cell && cell.v;
        if (typeof (value) === "string") {
            const trimmedValue = value.trim();

            if (trimmedValue === '' || trimmedValue === '-')
                value = undefined;
        }

        return value;
    }
}

const publicationsParser = new PublicationsParser();
export default publicationsParser;