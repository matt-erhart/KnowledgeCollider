//used as selectedActivations: activationSelector(state) in ForceGraph mapStateToProps
import {createSelector} from 'reselect';
import _ from 'lodash';
import stats from 'simple-statistics'
const activationLevel = state => state.activationLevel;
const allActivations = state => state.activations;
const links = state => state.graph.links;
const lockedNodes = state => state.selectedNodes.lockedNodes;
const selectedNodeID   = state => state.selectedNodes.selectedNodeID;


const nodeActivationFromSelection = (activationLevel, allActivations, links, lockedNodes, selectedNodeID) => {
    console.log('level',activationLevel,
    'activations', allActivations,
     'links', links, 
     'locked', lockedNodes,
     'selected', selectedNodeID)
    let activations = allActivations[activationLevel];
    let allSelected = selectedNodeID? [selectedNodeID, ...lockedNodes]: lockedNodes;
    let activationArray = allSelected.map((id, i) => activations[id]);
    var zippedActivations = _.zip.apply(_, activationArray);
    var aggActivations = zippedActivations.map(row => stats.geometricMean(row));
    let sortedNodesActivations = aggActivations.map(activation => Math.log(activation));
    if (links){
        let linkActivations = 
        links.map((link,i)=>{
            var nodesMean = stats.mean([aggActivations[link.nodeIxs[0]],aggActivations[link.nodeIxs[1]]]);
            return nodesMean < .2 ? .2 : nodesMean * 1.5;
        });  
        return {nodes: sortedNodesActivations, links: linkActivations};
    } else {
       return {nodes: [], links: []};
    }
  }

  export default createSelector(
        activationLevel,
        allActivations,
        links,
        lockedNodes,
        selectedNodeID,
        nodeActivationFromSelection
  )