import React, { Component } from 'react';
import { connect } from 'react-redux';
import selector from './selector'
import { schemeCategory20 } from 'd3-scale';
import { InteractiveForceGraph, ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

function mapStateToProps(state) {
  return { 
    nodes: state.graph.nodes,
    links: state.graph.links,
    selectedNeighbors: selector(state)
 }
}

function mapDispatchToProps(dispatch) {
  return {
    selectNode: (id) => dispatch({ type: 'NODE_SELECTED', nodeID: id }),
  }
}

class App extends Component {
  render() {
      const SelectedList = (props) => {
        //props.neighbors = {authors, nodeNames, paperNames}
        // console.log(props.neighbors? 'yea':'nah')
      if (props.neighbors.hasOwnProperty('paperNames') && props.neighbors.paperNames.length > 0) {
        console.log(props.neighbors.paperNames)
        return (
          <ul className="flexItem list-group">
            <li style={{'backgroundColor': 'lightblue'}} className="list-group-item"><b>Papers</b></li>
          { props.neighbors.paperNames.map((node,i) => {
                return <li className="list-group-item" key={'selected-' + i}>  {node} </li>
              }) }
          <li style={{'backgroundColor': 'lightblue'}} className="list-group-item"><b>Authors</b></li>
          { props.neighbors.authors.map((node,i) => {
            return <li className="list-group-item" key={'selected-' + i}>  {node} </li>
          }) }
          <li style={{'backgroundColor': 'lightblue'}} className="list-group-item"><b>Neighbor Nodes</b></li>
          { props.neighbors.nodeNames.map((node,i) => {
            return <li className="list-group-item" key={'selected-' + i}>  {node} </li>
          }) }
          </ul>)
      } else {
        return <ul className="flexItem list-group"> <li className="list-group-item"> select a node </li> </ul>
      }
    }

    return (
      <div>
      <InteractiveForceGraph zoom highlightDependencies>
        {/*there is also onSelectNode and onDeselectNode*/}
        {this.props.nodes.map(node => (
          <ForceGraphNode
            key={node.id}
            node={{ ...node, radius: 5 }}
            onClick={() => this.props.selectNode(node.id)}
          />
        ))}
        {this.props.links.map(link => (
          <ForceGraphLink
            key={`${link.source}=>${link.target}`}
            link={{ ...link, value: 2 }}
          />
        ))}
      </InteractiveForceGraph>

      <div className="App flexContainer">
        <ul className="flexItem list-group">
          <li style={{'backgroundColor': 'lightblue'}} className="list-group-item"><b>Nodes</b></li>
          {this.props.nodes.map((node,i) => {
            return <li className="list-group-item" style={{'cursor': 'pointer'}} key={'node' + i} onClick={() => this.props.selectNode(node.id)}>  {node.name} </li>
          })}
        </ul>
         <SelectedList neighbors={this.props.selectedNeighbors}/>          
      </div>
       </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)