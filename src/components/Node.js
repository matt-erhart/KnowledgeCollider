import React from 'react';
// import PropTypes from 'prop-types'
import styled from 'styled-components'

export const CircleCss = styled.circle`
    fill: blue;
    fill-opacity: 1;
    stroke: darkgrey;
    stroke-width: 5px;
    stroke-opacity: .8;
    &:hover {
      fill:   lightblue;
      stroke: lightblue;
    }
`

export default (props) => {
    //start with a circle

}