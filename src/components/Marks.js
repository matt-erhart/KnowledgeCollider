/*here we're using two different ways to do styles in react:
one is a package called styled-components which uses string literals
to add plain css to a react component. Thats the magic of the weird styled.div`...`
react components also take a prop called styles which takes an object
of camelcased css properties (.e.g. fillOpacity instead of fill-opacity).
styled-components offer many benefits over inline styles 
(any css can be used,  auto-prefixing included, better composition),
*/

import styled from 'styled-components';
import Rectangle from './Rectangle'
// Circles
export const circleStyle = (node, isSelected) => {
    let opacity = isSelected? .1: .2;
    let color = 'white'
    switch (node.type){
        case 'author': color = 'red'; break;
        case 'paper':  color = '#00BFFF'; break;
        default: color = '#247'
    }
    return {
        'opacity': opacity,
        'fill': color,
    }
}

// Links
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

//Text: seems to need inline styles to get text measurements to work
export const styleText = (node, isSelected, isLocked, activation) => {
    let opacity  = 0;
    let isPaper  = (node.type === "paper");
    let isAuthor = (node.type === "author");
    let isRoot   = (node.distance_from_root_min == 0);
    if (isPaper)  {opacity = 0}
    if (isAuthor || isRoot) {opacity = 1}
    let logSize = parseInt(6 + Math.log(node.paperID.length) * 10).toString()
    let fontSize = logSize < 10 ? 10+'px' : logSize+'px';
    let fill = (isRoot || isAuthor)? 'darkgrey' : 'black'
    opacity  = (isSelected||isLocked||activation)? 1: opacity;
    fill = activation? 'black': fill;
    return {
        'fillOpacity': opacity,
        'fontSize': fontSize,
        'fill': fill,
        'fontWeight': 'bold',
        'fontFamily': 'Helvetica',
        'pointerEvents': 'none',
    }
}

//rects: &:hover is something only styled components can do via css in js
export const RectCss = styled(Rectangle)`
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