import React, { PureComponent  } from 'react';
import PropTypes from 'prop-types'; // ES6
import styled from 'styled-components';

//rects: &:hover is something only styled components can do via css in js
export const RectCss = styled.rect`
    fill: lightgrey;
    fill-opacity: ${props => (props.isSelected||props.activation||props.isLocked)? .5:0};
    stroke: ${props => {
        return (props.isSelected || props.isLocked)? 'black':'none'
    }};
    stroke-width: ${props => props.isLocked? '3px': '1px'};
    &:active {
        stroke-opacity: 1;
        fill-opacity: 1;
        stroke-width: '1px';
        stroke: 'black';
    }
    &:hover {
        fill-opacity: .5;
    }
    &:hover ~ text tspan {
        fill-opacity: 1;
        fill: 'black';
    }
`

class Rectangle extends PureComponent  {
    constructor(props){
        super(props)
    }
    render(){
        return <RectCss {...this.props} />
    }
}

Rectangle.PropTypes = {
    isSelected: PropTypes.bool,
    activation: PropTypes.bool,
    isLocked: PropTypes.bool
}

export default Rectangle