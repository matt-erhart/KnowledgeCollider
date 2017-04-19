import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux'; //passes store into the app
// import { Router, Route, browserHistory } from 'react-router'; //back button needs history
import App from './App'; //actual app starts here

 const Root = ({ store }) => (
  <Provider store={store}>
    <App/>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
