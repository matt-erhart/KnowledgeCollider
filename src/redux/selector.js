import {createSelector} from 'reselect'
import _ from 'lodash'

const selectedNodeState = state => state.selectedNode.nodeID;
const nodesState        = state => state.graph.nodes;
const neighborsState    = state => state.neighbors;
const papersState       = state => state.papers;


const neighboringNodes = (selectedNode, nodes, neighbors, papers ) => {
    if (selectedNode) {
        let neighborNodeIDs = neighbors[selectedNode][1];
        let selectedNodeIndex = _.findIndex(nodes, node => { return node.id === selectedNode });
        let nodeIndexes     = neighborNodeIDs.map(id => _.findIndex(nodes, node => { return node.id === id; }));
        let nodeNames       = nodeIndexes.map(index => nodes[index].name);
        let authors         = nodes[selectedNodeIndex].authors;
        let paperIDs        = nodes[selectedNodeIndex].paperID;
        let paperIndexes    = paperIDs.map(id => _.findIndex(papers, paper => { return paper.paperID === id; }));
        let paperNames      = paperIndexes.map(index => papers[index].title);
        return {nodeNames, authors, paperNames}
    } else {
        return ''
    }
}

export default createSelector(
    selectedNodeState,
    nodesState,
    neighborsState,
    papersState,
    neighboringNodes
)