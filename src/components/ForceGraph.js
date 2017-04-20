import React, { Component } from 'react';
import Measure from 'react-measure';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import bboxCollide from './boundingBoxCollide'
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
           percentComplete: 0,
           bboxesReady: false,
           bboxes: []   }  
  constructor(props, context) {
      super(props, context);
      this.Viewer = null;
      this.bboxes = [];
  }

  componentDidMount() {
      if (this.Viewer) this.Viewer.fitToViewer();
      var boxes = graph.nodes.reduce((acc, node) => {
            var out = {[node.id]: { id: node.id, width: this.refs[node.id].bbox.width,
                       height: this.refs[node.id].bbox.height }}
            return Object.assign(acc, out)
      },[])
      this.setState({bboxes: boxes})
  }

  componentDidUpdate(){
      console.count('n componentDidUpdate:')
      
      if (this.state.bboxes && !this.state.simulationReady){
        let bbox_array = [];
        graph.nodes.forEach((node,i) => {
            let bbox = this.state.bboxes[node.id];
            graph.nodes[i].bbox = bbox;
            bbox_array.push([[-bbox.width /2, -bbox.height/2], [bbox.width /2, bbox.height/2]])
        })
        let rectangleCollide = bboxCollide(function (d,i) {
                    return bbox_array[i]
                    })
                    .strength(.9)
                    .iterations(1)
        
     var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            if (!d.id) debugger
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .velocityDecay(.6)
        .force("center", d3.forceCenter(500,500))
        .force("collide", rectangleCollide)
        .on('end', () => {
            this.setState({simulationReady: true, graph: graph})
        } )
        simulation.nodes(graph.nodes)
        simulation.force("link").links(graph.links)
        setTimeout(() => {
            simulation.stop()
            this.setState({simulationReady: true, graph: graph})
        }, 5000);               
      }
    }
    

  componentWillMount(){   }

  render() {  
    

        // console.log(this.state.bboxes,this.state.simulationReady)
        if (this.state.bboxes && this.state.simulationReady) {
            return (<svg height='1500' width='1500'>
                    {this.state.graph.nodes.map((node, i) => {
                        return <Text key={node.id} x={node.x} y={node.y} width={100}>{node.name}</Text>
                    })}
                    {this.state.graph.nodes.map((node, i) => {
                        return (<rect key={'rect-' + node.id} x={node.x} y={node.y}
                         width={node.bbox.width} height={node.bbox.height} style={{'fill': 'none', 'stroke': 'black'}}
                         />)
                    })}
                </svg>
            )
        } else {
             return (
            <svg height='1500' width='1500'>
                    {this.state.graph.nodes.map((node, i) => {
                        return <Text key={'text-' + node.id} ref={node.id}
                            x={50} y={50} width={100}>{node.name}</Text>
                    })}
                </svg>
             )
        }


          return (<h1>...</h1>)
      
  }
}
