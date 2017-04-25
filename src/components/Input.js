import React from 'react';
import TextField from 'material-ui/TextField';

const TextFieldExampleSimple = () => (
  <div>
    <TextField onEnter={(e)=>console.log(e)}
      hintText="Enter top N activated nodes to show"
    />
  </div>
);

export default TextFieldExampleSimple;