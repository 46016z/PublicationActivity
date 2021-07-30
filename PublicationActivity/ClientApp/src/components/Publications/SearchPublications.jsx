import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Collapse, Spinner, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { PublicationFields } from './PublicationFields';
import { defaultPublicationState } from '../../config/publicationConfig'; 
import apiService from '../../services/apiService';
import { PublicationsGrid } from './PublicationsGrid';
import publicationsProcessor from '../../services/publicationsProcessor';
import notificationsService from '../../services/notificationsService';
import PublicationsExporter from './PublicationsExporter';

const SearchPublications = () => {
  const { t } = useTranslation();

  const [predefinedData, setPredefinedData] = useState();
  const [filters, setFilters] = useState({});
  const [shouldRenderFormFields, setShouldRenderFormFields] = useState(false);
  const [areFiltersOpen, setAreFiltersOpen] = useState(false);
  const [searchResults, setSearchResults] = useState();
  const [isSearchInProgress, setIsSearchInProgress] = useState(false);

  useEffect(() => {
      (async () => {
          setPredefinedData(await apiService.getPublicationPredefinedData());
          setShouldRenderFormFields(true);
      })();
  }, []);

  const searchPublications = async () => {
    setIsSearchInProgress(true);
    
    try {
      const processedFilters = publicationsProcessor.processPublication(filters);
      const results = await apiService.getFilteredPublications(processedFilters);
      const processedResults = await publicationsProcessor.processDbPublications(results);

      setSearchResults(processedResults);
    } catch(err) {
      const errorMessage = err.exceptionType ? t(err.exceptionType) : err.message;
      notificationsService.error(errorMessage);
    }

    setAreFiltersOpen(false);
    setIsSearchInProgress(false);
  };

  return (
    <>
      <Row>
        <Col className={'mb-3'}>
          <h2>{t('ui.searchPublications')}</h2>
        </Col>
      </Row>
      <Row>
        <Col className={'mb-3'}>
          <Button color="primary" className={'mr-2'} onClick={() => setAreFiltersOpen(!areFiltersOpen)}>{areFiltersOpen ? t('ui.hideFilters') : t('ui.showFilters')}</Button>
          <Button color="success" className={'mr-2'} disabled={isSearchInProgress} onClick={() => searchPublications()}>{isSearchInProgress ? <Spinner type="grow" size={'sm'} color="primary" /> : t('ui.search')}</Button>
          <PublicationsExporter publications={searchResults} />
          <Collapse isOpen={areFiltersOpen}>
            <Row>
              <Col className={'mt-3'}>
                <Form>
                  {shouldRenderFormFields && <PublicationFields
                    labelsTranslationPrefix={'publication.fields'}
                    defaultPublicationState={defaultPublicationState}
                    predefinedData={predefinedData}
                    enableValidation={false}
                    onFieldUpdated={updatedFilters => setFilters(updatedFilters)} />}
                </Form>
              </Col>
            </Row>
          </Collapse>
        </Col>
      </Row>
      <Row>
        <Col>
            {searchResults && !!searchResults.length && <PublicationsGrid publications={searchResults} />}
        </Col>
      </Row>
    </>
  );
};

export { SearchPublications };
