// import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './Root'; //passes redux store to App, sets up routing, and routes to the App
import configureStore from './configureStore'; //this is where redux state starts
import './index.css';

const store = configureStore();
console.log('store',store.getState())
render(
  <Root store={store} />,
  document.getElementById('root')
);

