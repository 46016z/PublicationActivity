import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import apiService from '../../services/apiService';
import { PublicationsGrid } from './PublicationsGrid';
import publicationsProcessor from '../../services/publicationsProcessor';
import notificationsService from '../../services/notificationsService';
import { useTranslation } from 'react-i18next';
import PublicationsExporter from './PublicationsExporter';

const MyPublications = () => {
  const { t } = useTranslation();

  const [userPublications, setUserPublications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const results = await apiService.getUserPublications();

        if (results && results.length) {
          const processedResults = await publicationsProcessor.processDbPublications(results);
          setUserPublications(processedResults);
        }
      } catch (err) {
        const errorMessage = err.exceptionType ? t(err.exceptionType) : err.message;
        notificationsService.error(errorMessage);
      }
    })();
  }, []);

  return (
    <>
      <Row>
        <Col className={'mb-3'}>
          <h2>{t('ui.myPublications')}</h2>
        </Col>
      </Row>
      <Row>
        <Col className={'mb-3'}>
          <PublicationsExporter publications={userPublications} />
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={{
            maxWidth: '100%',
            overflowX: 'auto'
          }}>
            {!!(userPublications.length) && <PublicationsGrid publications={userPublications} />}
          </div>
        </Col>
      </Row>
    </>
  );
};

export { MyPublications };
