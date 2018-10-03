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
  const token = localStorage.getItem('token'); // localstorage is a global obj. 
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
// The following is a higher order-ish component that runs isAuthenticated. and then does a ternary.
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route 
    {...rest} 
    render={props =>(
      isAuthenticated() ? 
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
      <PrivateRoute path="/viewTeam/:teamId?/:channelId?" exact component={ViewTeam} /> 
      {/* /:teamId?/ is an optional parameter */}
      <PrivateRoute path="/createTeam" exact component={CreateTeam} />
    </Switch>
  </BrowserRouter>
);