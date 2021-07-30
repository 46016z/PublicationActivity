import React, { useEffect, useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import LoginMenu from '../Authorization/LoginMenu';
import authService from '../../services/authorizeService'
import './NavMenu.scss';
import Role from '../../models/Role';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../../common.config';

const NavMenu = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const [collapsed, setCollapsed] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const setActiveLanguage = async (languageIdentifier) => {
    await i18n.changeLanguage(languageIdentifier);
    setSelectedLanguage(languageIdentifier);
  };

  useEffect(() => {
    (async () => {
      setIsAdmin(await authService.hasRole(Role.Admin));
    })();
  }, []);

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
        <div className="container navigation-container">
          <NavbarBrand tag={Link} to="/" className="navbar-brand">Publication Activity</NavbarBrand>
          <NavbarToggler onClick={() => setCollapsed(c => !c)} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              {isAdmin && (
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/administration">{t('ui.administration')}</NavLink>
                </NavItem>
              )}
              <UncontrolledDropdown setActiveFromChild>
                <DropdownToggle tag="a" className="nav-link uppercase language-dropdown" caret>
                  {selectedLanguage}
                </DropdownToggle>
                <DropdownMenu onSelect={e => console.log(e.target.value)}>
                  {supportedLanguages.map(l => (<DropdownItem key={l.identifier}
                                                              active={selectedLanguage === l.identifier}
                                                              className="uppercase"
                                                              onClick={() => setActiveLanguage(l.identifier)}>{l.identifier}</DropdownItem>))}
                </DropdownMenu>
              </UncontrolledDropdown>
              <LoginMenu />
            </ul>
          </Collapse>
        </div>
      </Navbar>
    </header>
  );
};

export {
  NavMenu
};
