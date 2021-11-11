import React from 'react';
import { Switch, Route } from 'react-router';

import LoginPage from './containers/LoginPage';
import LoggedInPage from './containers/LoggedInPage';
import IndexPage from './containers/IndexPage'
export default (
  <Switch>
    <Route exact path="/" component={IndexPage} />
    <Route exact path="/loggedin" component={LoggedInPage} />
  </Switch>
);
