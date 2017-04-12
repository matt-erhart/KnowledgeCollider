import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import calcBBoxes from './calcBBoxes'
import {store} from './index'

export default class MeasureText extends Component {
  componentDidMount(){
   this.d3Node = d3.select(ReactDOM.findDOMNode(this))
   const bboxes = calcBBoxes(this.d3Node, this.props.nodes);
   store.dispatch({type: 'CALC_BBOXES', bboxes: bboxes})
  }
  render() {
    return <svg></svg>
  }

}