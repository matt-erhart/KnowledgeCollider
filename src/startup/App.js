import React, { Component } from 'react';
import ForceGraph from '../components/ForceGraph'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <ForceGraph />
      </MuiThemeProvider>
    )
  }
}