import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Administration } from './components/Administration/Administration';
import AuthorizeRoute from './components/Authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/Authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './config/apiAuthorizationConstants';

import './custom.scss'
import 'notyf/notyf.min.css';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Switch>
          <AuthorizeRoute exact path='/' component={Home} />
          <AuthorizeRoute path='/administration' component={Administration} />
          <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
        </Switch>
      </Layout>
    );
  }
}
