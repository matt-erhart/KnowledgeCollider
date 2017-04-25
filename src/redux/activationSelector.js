//used as selectedActivations: activationSelector(state) in ForceGraph mapStateToProps
import {createSelector} from 'reselect';
import _ from 'lodash';
import stats from 'simple-statistics'
const activationSettings = state => state.activationSettings;
const allActivations = state => state.activations;
const links = state => state.graph.links;
const lockedNodes = state => state.selectedNodes.lockedNodes;
const selectedNodeID   = state => state.selectedNodes.selectedNodeID;


const nodeActivationFromSelection = (activationSettings, allActivations, links, lockedNodes, selectedNodeID) => {
    let activations = allActivations[activationSettings.activationLevel];
    let allSelected = selectedNodeID? _.uniq([selectedNodeID, ...lockedNodes]): lockedNodes;
    console.log(allSelected)
    let activationArray = allSelected.map((id, i) => activations[id]);
    var zippedActivations = _.zip.apply(_, activationArray);
    var aggActivations = zippedActivations.map(row => stats.geometricMean(row));
    let sortByValue = aggActivations.slice().sort().reverse();
    let minRank = activationSettings.topN+allSelected.length;
    let topActivations = aggActivations.map(val => sortByValue.indexOf(val) < minRank? 1:0);//top 10 not locked
    
    if (links){
        let linkActivations = 
        links.map((link,i)=>{
            var nodesMean = stats.mean([topActivations[link.nodeIxs[0]],topActivations[link.nodeIxs[1]]]);
            return nodesMean;
        });  
        return {nodes: topActivations, links: linkActivations};
    } else {
       return {nodes: [], links: []};
    }
  }

  export default createSelector(
        activationSettings,
        allActivations,
        links,
        lockedNodes,
        selectedNodeID,
        nodeActivationFromSelection
  )