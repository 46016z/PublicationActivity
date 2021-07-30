import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { MyPublications } from './Publications/MyPublications';
import { SearchPublications } from './Publications/SearchPublications';
import { CreatePublication } from './Publications/CreatePublication';
import { ImportPublications } from './Publications/ImportPublications';
import { useTranslation } from 'react-i18next';
import authService from '../services/authorizeService'
import Role from '../models/Role';

const Home = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [isPowerUser, setIsPowerUser] = useState(false);

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const tabsConfiguration = [
    {
      title: 'ui.myPublicationsShort',
      Component: MyPublications
    },
    ...(isPowerUser ? [{
      title: 'ui.searchPublicationsShort',
      Component: SearchPublications
    }] : []),
    {
      title: 'ui.createPublicationShort',
      Component: CreatePublication
    },
    {
      title: 'ui.importPublicationsShort',
      Component: ImportPublications
    }
  ];

  useEffect(() => {
    (async () => {
      setIsPowerUser(await authService.hasRole([Role.HeadUser, Role.Admin]));
    })();
  }, []);

  return (
    <Row>
      <Col sm="12" md="2">
        <Nav tabs vertical className={'mb-3'}>
          {tabsConfiguration.map((tab, i) => (
            <NavItem key={i}>
              <NavLink
                className={classnames({ active: activeTab === i })}
                onClick={() => toggle(i)}>
                {t(tab.title)}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Col>
      <Col sm="12" md="10">
        <TabContent activeTab={activeTab}>
          {tabsConfiguration.map((t, i) => (
            <TabPane key={i} tabId={i}>
              {activeTab === i ?
                <Row>
                  <Col sm="12">
                    {(<t.Component />)}
                  </Col>
                </Row> : null}
            </TabPane>
          ))}
        </TabContent>
      </Col>
    </Row>
  );
};

export { Home };
