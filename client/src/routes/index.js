import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateTeam from './CreateTeam';
import ViewTeam from './ViewTeam';

// This is the front end authentication to redirect if user is not logged in. `
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
  } catch (err) {
    return false;
  }

  return true;
};
// Notice createTeam is a private route below. 
// The following is a higher order-ish component that takes the route 
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} 
      render={props =>( isAuthenticated() ? 
      ( <Component {...props} /> ) : 
      ( <Redirect to={{ pathname: '/login', }} /> )
    )}
  />
);

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <Route path="/viewTeam/:teamId?/:channelId?" exact component={ViewTeam} />
      <PrivateRoute path="/createTeam" exact component={CreateTeam} />
    </Switch>
  </BrowserRouter>
);