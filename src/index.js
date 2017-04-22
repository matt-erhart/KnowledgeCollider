// import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './startup/Root'; //passes redux store to App, sets up routing, and routes to the App
import configureStore from './redux/configureStore'; //this is where redux state starts
import './startup/index.css';

export const store = configureStore();
render(
  <Root store={store} />,
  document.getElementById('root')
);