
import React, { PureComponent  } from 'react';
import PropTypes from 'prop-types'; // ES6
import styled from 'styled-components';

export const hideAuthorEdges = (linkType) => {
    let hideEdge = (linkType === "paper-edge" || linkType === "author-paper-edge");
    return hideEdge ? 'none':'darkgrey' 
}
export const dashAnalogies = (linkType) => {return (linkType === "analogy") ? "5,5": 'none'}
export const colorAnalogies = (linkType) => {
    let isAnalogy = (linkType === "analogy")
    return isAnalogy ? "red": 'grey'}

export const LinkCss = styled.line`
    stroke: ${props => hideAuthorEdges(props.linkType)};
    stroke-dasharray: ${props => dashAnalogies(props.linkType)};
    stroke-width: ${props=> props.activation > 0? props.activation*2: 1};
    stroke-opacity: ${props=> props.activation > 0? props.activation: .2};
    `
class Line extends PureComponent  {
    constructor(props){
        super(props)
    }
    render(){
        return <LinkCss {...this.props} />
    }
}

Line.PropTypes = {
    isSelected: PropTypes.bool,
    activation: PropTypes.bool,
    isLocked: PropTypes.bool
}

export default Line