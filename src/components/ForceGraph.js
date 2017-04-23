/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import selector from '../redux/selector'
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import 'bootstrap/dist/css/bootstrap.css';
import graphjson from     '../assets/data/graph.json';
import activations from '../assets/data/activations0.5.json';
import styled from 'styled-components';
import Text from './Text'; 
import * as marks from './Marks'; //namespace import: all Marks exports into marks.*
import forceSimulation from '../services/ForceSimulation'
import './text.css'
function mapStateToProps(state) {
  return { 
    graph: state.graph,
    selectedNeighbors: selector(state),
    selectedNode: state.selectedNode
 }
}

function mapDispatchToProps(dispatch) {
  return {
    selectNode: (id) => dispatch({ type: 'NODE_SELECTED', nodeID: id }),
    setGraph: (graph) => dispatch({type: 'SET_GRAPH', graph}),
    loadLocalGraph: (graph) => dispatch({type: 'GET_LOCAL_STORAGE_GRAPH', graph}),
  }
}

class ForceGraph extends Component {
    //add to redux
  state = {pad: 10,
           padOffset: 5}  
  constructor(props, context) {
      super(props, context);
      this.Viewer = null;
  }

  componentDidMount() {
      if (this.Viewer) this.Viewer.fitToViewer();
        // let test = JSON.parse(localStorage.getItem("graph"))
        // console.log('test', test)
        let localGraph = JSON.parse(localStorage.getItem("graph"));
        if (localGraph.hasOwnProperty('nodes')) {
            this.props.loadLocalGraph(localGraph)
        } else {
        var boxes = graphjson.nodes.forEach((node, i) => {
            node.bbox = { //.refs is a react ref to a DOM text element we need to measure
                width:  this.refs[node.id].bbox.width + this.state.pad,
                height: this.refs[node.id].bbox.height + this.state.pad
            };
        })
        let graphWithSimulationInfo = forceSimulation(graphjson, 1200, 1024);
        localStorage.setItem("graph", JSON.stringify(graphWithSimulationInfo));
        this.props.setGraph(graphWithSimulationInfo)
        }
  }

  componentDidUpdate(){}
    
  componentWillMount(){  
      //comment this out to make a fresh simulation
        // var localGraph = JSON.parse(localStorage.getItem('graph')) || [];
        // this.setState({graph: localGraph, simulationReady: true})
   }

  render() {  
        // console.log(this.state.bboxes,this.state.simulationReady)
        if (this.props.graph.hasOwnProperty('nodes')) {
            return (
            <ReactSVGPanZoom background='white' tool='auto'
                    style={{outline: "1px solid black"}}
                    width={1200} height={1024} ref={Viewer => this.Viewer = Viewer}>
            <svg height='1200' width='1024'>
                    {this.props.graph.links.map((link,i)=> {
                        return <marks.LinkCss key={'link-' + i + link.id} 
                        linkType={link.type}
                        x1={link.source.x} y1={link.source.y} 
                        x2={link.target.x} y2={link.target.y}/>
                    })}
                    {this.props.graph.nodes.map((node, i) => {
                        let {id, x, y, name} = node; //destructuring
                        let {width, height}  = node.bbox;
                        let isSelected = this.props.selectedNode.nodeID === node.id;
                        return (
                        <g key={'g-' + id}   >
                            <circle key={'circle-' + id} cx={x} cy={y}
                            r='8' style={marks.circleStyle(node, isSelected)}
                            />
                            <marks.RectCss key={'rect-' + id} rx="5" ry="5" 
                                x={x-this.state.padOffset - (width/2)} 
                                y={y-this.state.padOffset - (height/2)}
                                width={width} height={height}
                                onClick={(e) => this.props.selectNode(id)}
                                isSelected = {isSelected}
                                className='hover'
                            />
                            <Text style={marks.styleText(node, isSelected)}
                                key={'text-' + id} 
                                x={x - (width/2)} y={y- (height/2)} width={125}
                                >
                                {name}
                            </Text>
                            
                         </g>
                         )
                    })}
                </svg>
                </ReactSVGPanZoom>
            )
        } else { 
            /* run this first to get the size of text labels. Then, in componentdidmount,
            we pass these bounding boxes to the redux store
            which will update the state and result in only the graph showing up. */
             return (
            <svg height='1024' width='1024'>
                    {graphjson.nodes.map((node, i) => {
                        return <Text style={Object.assign(marks.styleText(node), {'fill':'white'})}
                        key={'text-' + node.id} ref={node.id}
                        x={50} y={50} width={125}>{node.name}</Text>
                    })}
                    <text x={50} y={50}> Building the graph </text>
                </svg>
             )
        }
    return (<h1>...</h1>)  
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForceGraph)