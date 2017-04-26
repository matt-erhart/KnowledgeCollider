import React, { PureComponent  } from 'react';

export default class Circle extends PureComponent  {
    constructor(props){
        super(props)
    }
    render(){
        return <circle {...this.props} />
    }
}