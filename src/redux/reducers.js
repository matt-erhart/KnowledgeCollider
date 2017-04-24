//data gets loaded using those import statements
import neighbors from '../assets/data/node_neighborhoods.json'
import authors from   "../assets/data/author_connections.json"
import papers from    "../assets/data/papers.json"
import activations25 from '../assets/data/activations0.25.json';
import activations50 from '../assets/data/activations0.5.json';
import activations75 from '../assets/data/activations0.75.json';

import _ from 'lodash'
//these functions (called reducers in redux) get called by redux to pull data into the redux store
// Might take up a lot of memory later on.
export const graph = (state = {}, action) => { 
    switch (action.type){
        case 'SET_GRAPH': return action.graph
        case 'GET_LOCAL_STORAGE_GRAPH': return action.graph
        default: return state
    }    
 }
export const importNeighborsJSON = () => { return neighbors}
export const importAuthorsJSON = () => { return authors }
export const importPapersJSON = () => { return papers }
export const importActivationsJSON = () => { return {25: activations25, 50: activations50, 75: activations75} }


export const selectNodes = (state = {selectedNodeID: '', lockedNodes: []}, action) => {
    console.log('selectnodes reducer',state)
    switch (action.type){
        case 'SELECT_NODE': return   {...state, selectedNodeID: action.nodeID }
        case 'UNSELECT_NODE': return {...state, selectedNodeID: ''}
        case 'LOCK_NODE':      
            return {...state, lockedNodes: _.concat(state.lockedNodes, action.nodeID)}
        case 'UNLOCK_NODE': 
            return {...state, lockedNodes: _.without(state.lockedNodes,action.nodeID)}
        default: return state
    }
}

export const selectActivationLevel = (state = '50', action) => {
    switch (action.type){
        case 'SET_ACTIVATION_LEVEL': return action.selectActivationLevel
        default: return state
    }
}