import React, { Component } from 'react';
// import {CircleCss} from '../components/Node'
import 'bootstrap/dist/css/bootstrap.css'
import * as d3 from 'd3'
import graph from     '../assets/data/graph.json';
import styled from 'styled-components'
import Text from './Text'

export const CircleCss = styled.circle`
    fill: blue;
    fill-opacity: .5;
    stroke: darkgrey;
    stroke-width: 5px;
    stroke-opacity: .8;
    &:hover {
      fill:   lightblue;
      stroke: lightblue;
    }
`
export const LinkCss = styled.line`
    stroke: darkgrey;
    stroke-width: 2px;
    stroke-opacity: .8;
    &:hover {
      fill:   lightblue;
      stroke: lightblue;
    }
`

export const RectCss = styled.rect`
    fill: blue;
    fill-opacity: .5;
    stroke: darkgrey;
    stroke-width: 5px;
    stroke-opacity: .8;
    &:hover {
      fill:   lightblue;
      stroke: lightblue;
    }
`

export default class ForceGraph extends Component {
  state = {simulationReady: false,
           graph: graph,
           percentComplete: 0  }  

  componentWillMount(){
        var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            if (!d.id) debugger
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .velocityDecay(.6)
        .force("center", d3.forceCenter(500,500))
        .on('tick', () => {
            this.setState({simulationReady: true, graph: graph})
        } )
        simulation.nodes(graph.nodes)
        simulation.force("link").links(graph.links)
        setTimeout(function() {
            simulation.stop()
        }, 5000);
  }

  render() {  
         if (false && this.state.simulationReady) {
           return ( 
           <svg height='1500' width='1500'>
                {console.log(this.state.graph.nodes[0].x)}
                {this.state.graph.nodes.map((node,i)=> {
                    return <CircleCss key={node.id} cx={node.x} cy={node.y} r='5'/>
                })}
                {this.state.graph.nodes.map((node,i)=> {
                    return <RectCss key={node.id} x={node.x-10} y={node.y-10} width='20' height='20'/>
                })}
                {this.state.graph.links.map((link,i)=> {
                    return <LinkCss key={link.id} x1={link.source.x} y1={link.source.y} x2={link.target.x} y2={link.target.y}/>
                })}
            </svg>)
         } else {
             return <svg><Text x={50} y={50} width={100}>is this working the way I want it to?</Text></svg>
         }
  }
}