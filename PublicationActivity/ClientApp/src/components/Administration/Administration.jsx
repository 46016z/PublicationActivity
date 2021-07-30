import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { AllUsers } from './AllUsers';
import { RegisterUser } from './RegisterUser';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authorizeService';
import Role from '../../models/Role';
import { Redirect } from 'react-router-dom'

const tabsConfiguration = [
  {
    title: 'ui.previewUsersShort',
    Component: AllUsers,
    colProps: {
      sm: 12
    }
  },
  {
    title: 'ui.registerUsersShort',
    Component: RegisterUser,
    colProps: {
      sm: 12,
      md: 6
    }
  }
];

const Administration = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [isAdmin, setIsAdmin] = useState();

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    (async () => {
      setIsAdmin(await authService.hasRole(Role.Admin) || false);
    })();
  }, []);

  if (typeof isAdmin == 'undefined') {
    return <div></div>;
  } else if (typeof isAdmin != 'undefined' && !isAdmin) {
    return <Redirect to={'/'} />;
  } else {
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
        <Col sm="12" md={10}>
          <TabContent activeTab={activeTab}>
            {tabsConfiguration.map((t, i) => (
              <TabPane key={i} tabId={i}>
                {activeTab === i ?
                  <Row>
                    <Col {...t.colProps}>
                      {(<t.Component />)}
                    </Col>
                  </Row> : null}
              </TabPane>
            ))}
          </TabContent>
        </Col>
      </Row>
    );
  }
};

export { Administration };
