/*here we're using two different ways to do styles in react:
one is a package called styled-components which uses string literals
to add plain css to a react component. Thats the magic of the weird styled.div`...`
react components also take a prop called styles which takes an object
of camelcased css properties (.e.g. fillOpacity instead of fill-opacity).
styled-components offer many benefits over inline styles 
(any css can be used,  auto-prefixing included, better composition),
*/

import styled from 'styled-components';

export const circleStyle = (node) => {
    let opacity = .2;
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

export const hideAuthorEdges = (linkType) => {
    let hideEdge = (linkType === "paper-edge" || linkType === "author-paper-edge");
    return hideEdge ? 'none':'black' 
}
export const dashAnalogies = (linkType) => {return (linkType === "analogy") ? "5,5": 'none'}
export const colorAnalogies = (linkType) => {
    let isAnalogy = (linkType === "analogy")
    return isAnalogy ? "red": 'grey'}

export const LinkCss = styled.line`
    stroke: ${props => hideAuthorEdges(props.linkType)};
    stroke-dasharray: ${props => dashAnalogies(props.linkType)};
    stroke-width: 1px;
    stroke-opacity: .2;
`

export const styleText = (node) => {
    let opacity  = 0;
    let isPaper  = (node.type === "paper");
    let isAuthor = (node.type === "author");
    let isRoot   = (node.distance_from_root_min == 0);
    if (isPaper)  {opacity = 0}
    if (isAuthor || isRoot) {opacity = 1}
    let logSize = parseInt(6 + Math.log(node.paperID.length) * 10).toString()
    let fontSize = logSize < 10 ? 10+'px' : logSize+'px';
    let fill = (isRoot || isAuthor)? 'darkgrey' : 'black'
    return {
        'opacity': opacity,
        'fontSize': fontSize,
        'fill': fill,
        'fontWeight': 'bold',
        'fontFamily': 'Helvetica'
    }
}

export const RectCss = styled.rect`
    fill: blue;
    fill-opacity: 0;
    stroke: darkgrey;
    stroke-width: 5px;
    stroke-opacity: 0;
`