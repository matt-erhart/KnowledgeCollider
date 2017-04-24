/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import selector from '../redux/selector'
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import 'bootstrap/dist/css/bootstrap.css';
import graphjson from     '../assets/data/graph.json';
import activations from '../assets/data/activations0.5.json';
import styled from 'styled-components';
import Text from './Text'; 
import * as marks from './Marks'; //namespace import: all Marks exports into marks.*
import forceSimulation from '../services/ForceSimulation'
import _ from 'lodash'

function sortNodes(){
    graph.nodes =  _.sortBy(graph.nodes, [function(node) { return node.id; }])
    let nodeIDs = graph.nodes.map(x => x.id);
    //get the nodes idxs for each link
    // map over links and search nodes for ixs, add [ix1, ix2] to each link, 
    const getIDs = (link) => [nodeIDs.indexOf(link.target), nodeIDs.indexOf(link.source)]
    graph.links.map( (link,i) => graph.links[i].nodeIxs = getIDs(link) )
    window.activationsAll = {25: activations25, 50: activations50, 75: activations75}
    console.log('graph',graph)
    window.selectedActivation = '50'
}

function mapStateToProps(state) {
  return { 
    graph: state.graph,
    selectedNodeID: state.selectedNodes.selectedNodeID,
    lockedNodes: state.selectedNodes.lockedNodes
 }
}

function mapDispatchToProps(dispatch) {
  return {
    selectNode: (id) => dispatch({ type: 'SELECT_NODE', nodeID: id }),
    unSelectNode: (id) => dispatch({ type: 'UNSELECT_NODE' }),
    lockNode: (id) => dispatch({ type: 'LOCK_NODE', nodeID: id }),
    unlockNode: (id) => dispatch({ type: 'UNLOCK_NODE', nodeID: id }),

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

  nodeActivationFromSelection = (selectedNodeID, lockedNodes) => {
    let allSelected = selectedNodeID? [selectedNodeID, ...lockedNodes]: lockedNodes;
    let activationArray = allSelected.map((id, i) => activations[id]);
    var zippedActivations = _.zip.apply(_, activationArray);
    var aggActivations = zippedArr.map(row => jStat(row).geomean())
    const scaleFunc = (ix) => {return (jStat.log([1 + aggActivations[ix]]))};
    let sortedNodesActivations = aggActivations.map(activation => scaleFunc(activation));
    let linkActivations = this.props.graph.links.map((link,i)=>{
        var nodesMean = jStat([aggActivations[link.nodeIxs[0]],aggActivations[link.nodeIxs[1]]]).mean();
        return nodesMean < .2 ? .2 : nodesMean * 1.5;
    })
    return {nodes: sortedNodesActivations, links: linkActivations}
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

  componentDidUpdate(){ }
  componentWillMount(){ }

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
                        let isSelected = this.props.selectedNodeID === node.id;
                        return (
                        <g key={'g-' + id}   >
                            <circle key={'circle-' + id} cx={x} cy={y}
                            r='8' style={marks.circleStyle(node, isSelected)}
                            />
                            <marks.RectCss key={'rect-' + id} rx="5" ry="5" 
                                x={x-this.state.padOffset - (width/2)} 
                                y={y-this.state.padOffset - (height/2)}
                                width={width} height={height}
                                onClick={(e) => isSelected?  this.props.unSelectNode(): this.props.selectNode(id)}
                                isSelected = {isSelected}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    console.log(this.props.lockedNodes, id)
                                    let isLocked = _.includes(this.props.lockedNodes, id);
                                    isLocked? this.props.unlockNode(id): this.props.lockNode(id)
                                    }}
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