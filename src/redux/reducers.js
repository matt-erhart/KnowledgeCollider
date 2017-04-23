//data gets loaded using those import statements
import neighbors from '../assets/data/node_neighborhoods.json'
import authors from   "../assets/data/author_connections.json"
import papers from    "../assets/data/papers.json"

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

export const selectedNode = (state = {nodeID: 0 }, action) => {
    switch (action.type){
        case 'NODE_SELECTED': return {nodeID: action.nodeID }
        default: return state
    }
}