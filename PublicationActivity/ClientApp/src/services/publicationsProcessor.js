class PublicationsProcessor {

    processPublication(publication) {
        if (!publication) {
            return publication;
        }

        return this._processPublication(publication);
    }

    processPublications(publications) {
        const processedPublications = [];

        if (!publications || !publications.length) {
            return [];
        }

        for (let i = 0; i < publications.length; i += 1) {
            const processedPublication = this._processPublication(publications[i]);

            processedPublications.push(processedPublication);
        }

        return processedPublications;
    }

    processDbPublications(dbPublications) {
        if (!dbPublications || !dbPublications.length) {
            return [];
        }

        return dbPublications.map(b => {

            if (!b.contributors || !b.contributors.length) {
                return { ...b };
            }

            const authorsAndCoAuthors = b.contributors.filter(c => !c.isStudentOrDoctorant);
            const studentsAndDoctorants = b.contributors.filter(c => c.isStudentOrDoctorant);

            const result = {
                ...b,
                authorsAndCoAuthors: this._processDbNames(authorsAndCoAuthors),
                studentsAndDoctorants: this._processDbNames(studentsAndDoctorants),
                bibliographyDescription: b.bibliographyDescription
            };
            delete result.contributors;

            return result;
        });
    }

    _processPublication(publication) {
        const contributors = [];

        if (publication.authorsAndCoAuthors) {
            const processed = this._processNames(publication.authorsAndCoAuthors);

            if (processed) {
                contributors.push(...processed);
            }
        }

        if (publication.studentsAndDoctorants) {
            const processed = this._processNames(publication.studentsAndDoctorants);

            if (processed) {
                contributors.push(...processed.map(c => ({ ...c, isStudentOrDoctorant: true })));
            }
        }

        const result = {
            ...publication,
            yearPublished: publication.yearPublished || 0,
            contributors: contributors.length ? contributors : null
        };
        delete result.authorsAndCoAuthors;
        delete result.studentsAndDoctorants;

        return result;
    }

    _processDbNames(names) {
        if (!names) {
            return names;
        }

        return names.map(n => `${n.firstName} ${n.lastName}`).join(', ');
    }

    _processNames(names) {
        if (!names) {
            return names;
        }

        try {
            return names.split(',').filter(n => n && n.trim()).map((n, i) => {
                const [firstName, lastName] = n.trim().split(' ').map(fln => fln.trim());
    
                if (!firstName || !lastName) {
                    throw new Error('Invalid formatting.');
                }

                return {
                    order: i,
                    firstName,
                    lastName
                };
            });
        } catch(err) {
            return null;
        }
    }
}

const publicationsProcessor = new PublicationsProcessor();
export default publicationsProcessor;