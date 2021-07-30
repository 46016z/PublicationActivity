import React from 'react';
import { NavMenu } from './NavMenu/NavMenu';

import './Layout.scss';

const Layout = ({ children }) => {

  return (
    <div>
      <NavMenu />
      <div className={'main-container'}>
        {children}
      </div>
    </div>
  );
};

export { Layout };
