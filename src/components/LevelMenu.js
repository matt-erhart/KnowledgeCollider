import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const style = {
  display: 'inline-block',
  margin: '16px 32px 16px 0',
};

export default (props) => (
  <div>
    <Paper style={style}>
      <Menu >
        <MenuItem onClick={e => props.setActivationLevel('25')} primaryText="Level .25" />
        <MenuItem onClick={e => props.setActivationLevel('50')} primaryText="Level .50" />
        <MenuItem onClick={e => props.setActivationLevel('75')} primaryText="Level .75" />
      </Menu>
    </Paper>
  </div>
);