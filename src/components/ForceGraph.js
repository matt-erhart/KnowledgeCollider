/* eslint-disable */
//update is slow because the reducers are slow
//could use immutable.js or take some data out of the store
//or improve the activationSelector
import React, { Component } from 'react';
import { connect } from 'react-redux';
import activationSelector from '../redux/activationSelector'
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import 'bootstrap/dist/css/bootstrap.css';
import graphjson from     '../assets/data/graph.json';
import styled from 'styled-components';
import Text from './Text'; 
import * as marks from './Marks'; //namespace import: all Marks exports into marks.*
import forceSimulation from '../services/ForceSimulation'
import _ from 'lodash'
import * as d3 from 'd3'
import LevelMenu from './LevelMenu'

const Input = (props) => {
    return (
    <form onSubmit={e=>{e.preventDefault()}}>
       <input type="number" name="topN" value={props.topN} onChange={e =>  props.setTopN(parseInt(e.target.value))}></input>
    </form>
    )
}

function sortNodes(){
    graphjson.nodes =  _.sortBy(graphjson.nodes, [function(node) { return node.id; }])
    let nodeIDs = graphjson.nodes.map(x => x.id);
    const getIDs = (link) => [nodeIDs.indexOf(link.target), nodeIDs.indexOf(link.source)]
    graphjson.links.forEach( (link,i) => link.nodeIxs = getIDs(link) )
}

function mapStateToProps(state) {
  return { 
    graph: state.graph,
    selectedNodeID: state.selectedNodes.selectedNodeID,
    lockedNodes: state.selectedNodes.lockedNodes,
    selectedActivations: activationSelector(state),
    topN: state.activationSettings.topN,
    activationLevel: state.activationSettings.activationLevel
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

    setTopN: (num) => dispatch({type: 'SET_TOP_N_ACTIVATIONS$', topN: num}),
    setActivationLevel: (level) => dispatch({type: 'SET_ACTIVATION_LEVEL', activationLevel: level})

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
        let localGraph = JSON.parse(localStorage.getItem("graph")) || [];
        if (localGraph.hasOwnProperty('nodes')) {
            this.props.loadLocalGraph(localGraph)
        } else {
        sortNodes()
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

  componentDidUpdate(){
   }
  componentWillMount(){ }

  render() {  

        if (this.props.graph.hasOwnProperty('nodes')) {
            return (
            <div>
            <ReactSVGPanZoom background='white' tool='auto' toolbarPosition='none'
                    style={{outline: "1px solid black"}}
                    width={1200} height={1024} ref={Viewer => this.Viewer = Viewer}>
            <svg height='1200' width='1024'>
                    {this.props.graph.links.map((link,i)=> {
                        return <marks.LinkCss key={'link-' + i + link.id} 
                        linkType={link.type}
                        x1={link.source.x-this.state.padOffset} y1={link.source.y-this.state.padOffset} 
                        x2={link.target.x-this.state.padOffset} y2={link.target.y-this.state.padOffset}
                        activation={this.props.selectedActivations.links[i]}
                        />
                    })}
                    {this.props.graph.nodes.map((node, i) => {
                        //console.log(colorScale(this.props.selectedActivations.nodes[i]), this.props.selectedActivations.nodes[i])
                        let {id, x, y, name} = node; //destructuring
                        let {width, height}  = node.bbox;
                        let isSelected = this.props.selectedNodeID === node.id;
                        let isLocked = _.includes(this.props.lockedNodes, node.id)
                        let activation = this.props.selectedActivations.nodes[i] === 1;
                        return (
                        <g key={'g-' + id}   >
                            <circle key={'circle-' + id} cx={x-this.state.padOffset} cy={y-this.state.padOffset}
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
                                    isLocked? this.props.unlockNode(id): this.props.lockNode(id)
                                    }}
                                activation={activation}
                                isLocked={isLocked}
                            />
                            <Text style={marks.styleText(node, isSelected, isLocked, activation)}
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
                Minimum activation rank <Input setTopN={this.props.setTopN} topN={this.props.topN}></Input> 
                <LevelMenu setActivationLevel={this.props.setActivationLevel}></LevelMenu>
                </div>
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