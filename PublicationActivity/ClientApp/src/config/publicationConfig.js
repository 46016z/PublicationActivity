const defaultPublicationState = {
    publicationType: '',
    originalTitle: '',
    yearPublished: '',
    publisherData: '',
    identifier: '',
    primaryReferenceLocation: '',
    secondaryReferenceLocation: '',
    tertiaryReferenceLocation: '',
    authorsAndCoAuthors: '',
    studentsAndDoctorants: '',
    isiImpactFactor: '',
    sjrScopusImpactRank: '',
    publicationLanguageCode: '',
    publicationLink: ''
};

const fullPublicationPropsMetadata = [
    {
        order: 0,
        name: 'publicationType',
        exportedColumnWidth: 25
    },
    {
        order: 1,
        name: 'originalTitle',
        exportedColumnWidth: 65
    },
    {
        order: 2,
        name: 'yearPublished',
        exportedColumnWidth: 15
    },
    {
        order: 3,
        name: 'publisherData',
        exportedColumnWidth: 100,
        exportedCellStyle: {
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'ffd9d9d9'
                }
            }
        }
    },
    {
        order: 4,
        name: 'identifier',
        exportedColumnWidth: 40,
        exportedColumnHeaderStyle: {
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'ff808080'
                }
            }
        },
        exportedCellStyle: {
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'ff808080'
                }
            }
        }
    },
    {
        order: 5,
        name: 'primaryReferenceLocation',
        exportedColumnWidth: 30
    },
    {
        order: 6,
        name: 'secondaryReferenceLocation',
        exportedColumnWidth: 30
    },
    {
        order: 7,
        name: 'tertiaryReferenceLocation',
        exportedColumnWidth: 30
    },
    {
        order: 8,
        name: 'authorsAndCoAuthors',
        exportedColumnWidth: 100
    },
    {
        order: 9,
        name: 'studentsAndDoctorants',
        exportedColumnWidth: 30
    },
    {
        order: 10,
        name: 'isiImpactFactor',
        exportedColumnWidth: 25
    },
    {
        order: 11,
        name: 'sjrScopusImpactRank',
        exportedColumnWidth: 25
    },
    {
        order: 12,
        name: 'publicationLanguageCode',
        exportedColumnWidth: 15
    },
    {
        order: 13,
        name: 'publicationLink',
        exportedColumnWidth: 30
    },
    {
        order: 14,
        name: 'bibliographyDescription',
        exportedColumnWidth: 100,
        exportedCellStyle: {
            alignment: {
                wrapText: true
            }
        }
    }
];

export {
    defaultPublicationState,
    fullPublicationPropsMetadata
};