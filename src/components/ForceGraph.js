/* eslint-disable */
import React, { Component } from 'react';
import Measure from 'react-measure';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import bboxCollide from './boundingBoxCollide'
// import {CircleCss} from '../components/Node'
import 'bootstrap/dist/css/bootstrap.css'
import * as d3 from 'd3'
import graph from     '../assets/data/graph.json';
import activations from '../assets/data/activations0.5.json'
import styled from 'styled-components'
import Text from './Text'

const circleStyle = (node) => {
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


const hideAuthorEdges = (linkType) => {
    let hideEdge = (linkType === "paper-edge" || linkType === "author-paper-edge");
    return hideEdge ? 'none':'black' 
}
const dashAnalogies = (linkType) => {return (linkType === "analogy") ? "5,5": 'none'}
const colorAnalogies = (linkType) => {
    let isAnalogy = (linkType === "analogy")
    return isAnalogy ? "red": 'grey'}

export const LinkCss = styled.line`
    stroke: ${props => hideAuthorEdges(props.linkType)};
    stroke-dasharray: ${props => dashAnalogies(props.linkType)};
    stroke-width: 1px;
    stroke-opacity: .2;
`

const styleText = (node) => {
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

//     .attr("font-size", d => sizeText(d, 'init'))
//     .attr('id', function (d) { return 'label' + d.id; })
//     .attr('dy', "1em")
//     .attr('fill', (d,i) =>{
//       if (d.type === 'author' || d.distance_from_root_min == 0){
//           return 'darkgrey'
//       } else {
//         return 'black'
//       }

//     })
//     .text(d => d.name)
//     .call(wrap, 125)
//   }


export const RectCss = styled.rect`
    fill: blue;
    fill-opacity: 0;
    stroke: darkgrey;
    stroke-width: 5px;
    stroke-opacity: 0;
`

export default class ForceGraph extends Component {
  state = {simulationReady: false,
           graph: graph,
           percentComplete: 0,
           bboxesReady: false,
           bboxes: [],
           pad: 10,
           padOffset: 5    }  
  constructor(props, context) {
      super(props, context);
      this.Viewer = null;
      this.bboxes = [];
  }

  componentDidMount() {
      if (this.Viewer) this.Viewer.fitToViewer();

      if (!this.state.simulationReady) {
          var boxes = graph.nodes.reduce((acc, node) => {
              var out = {
              [node.id]: {
                  id: node.id, width: this.refs[node.id].bbox.width + this.state.pad,
                  height: this.refs[node.id].bbox.height + this.state.pad
              }
              }
              return Object.assign(acc, out)
          }, [])
          this.setState({ bboxes: boxes })
          console.log(activations, graph.links)
      }
      
  }

  componentDidUpdate(){
      console.count('n componentDidUpdate:')
      
      if (this.state.bboxes && !this.state.simulationReady){
        let bbox_array = [];
        graph.nodes.forEach((node,i) => {
            let bbox = this.state.bboxes[node.id];
            graph.nodes[i].bbox = bbox;
            bbox_array.push([[-bbox.width /2 -5, -bbox.height/2 -5], [bbox.width /2 + 5, bbox.height/2 +5]])
        })
        let rectangleCollide = bboxCollide(function (d,i) {
                    return bbox_array[i]
                    })
                    .strength(.1)
                    .iterations(1)
        
     var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {
      return d.id;
    })
      .strength(function(d) {
        if (d.type == "analogy") {
          return 0.2;
        } else {
          return 1;
        }
      }))
    .force("charge", d3.forceManyBody().strength(function (d) {
      return -19 - Math.log(d.paperID.length) * 250 * 4; // give greater repulsion for larger nodes
    }))
    .force("center", d3.forceCenter(1024 / 2, (1024 / 2) + 300))
    .velocityDecay(.6)
    .force("collide", rectangleCollide)
    .on('end', () => {
            this.setState({simulationReady: true, graph: graph})
            localStorage.setItem('graph', JSON.stringify(graph));
        } )

        simulation.nodes(graph.nodes)
        simulation.force("link").links(graph.links)
        // setTimeout(() => {
        //     simulation.stop()
        //     this.setState({simulationReady: true, graph: graph})
        // }, 5000);               
      }
    }
    

  componentWillMount(){  
      //comment this out to make a fresh simulation
        var localGraph = JSON.parse(localStorage.getItem('graph')) || [];
        this.setState({graph: localGraph, simulationReady: true})
   }

  render() {  
        // console.log(this.state.bboxes,this.state.simulationReady)
        if (this.state.bboxes && this.state.simulationReady) {
            return (
            <ReactSVGPanZoom background='white'
                    style={{outline: "1px solid black"}}
                    width={1200} height={1024} ref={Viewer => this.Viewer = Viewer}>
            <svg height='1200' width='1024'>
                    {this.state.graph.links.map((link,i)=> {
                        return <LinkCss key={'link-' + i + link.id} 
                        linkType={link.type}
                        x1={link.source.x} y1={link.source.y} 
                        x2={link.target.x} y2={link.target.y}/>
                    })}
                    {this.state.graph.nodes.map((node, i) => {
                        let {id, x, y, name} = node; //destructuring
                        let {width, height}  = node.bbox;
                        return (
                        <g key={'g-' + id}>
                            <circle key={'circle-' + id} cx={x} cy={y}
                            r='8' style={circleStyle(node)}
                            />
                            <Text style={styleText(node)} key={'text-' + id} 
                                x={x - (width/2)} y={y- (height/2)} width={125}>
                                {name}
                            </Text>
                            d.x - bboxes[i].width/2
                            <RectCss key={'rect-' + id} rx="5" ry="5"
                                x={x-this.state.padOffset - (width/2)} 
                                y={y-this.state.padOffset - (height/2)}
                                width={width} height={height}
                            />
                         </g>
                         )
                    })}
                </svg>
                </ReactSVGPanZoom>
            )
        } else {
             return (
            <svg height='1024' width='1024'>
                    {this.state.graph.nodes.map((node, i) => {
                        return <Text style={Object.assign(styleText(node), {'fill':'white'})} key={'text-' + node.id} ref={node.id}
                            x={50} y={50} width={125}>{node.name}</Text>
                    })}
                    <text x={50} y={50}> Building the graph </text>
                </svg>
             )
        }
    return (<h1>...</h1>)  
  }
}
