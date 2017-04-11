import graph from     './data/graph.json';
import neighbors from './data/node_neighborhoods.json'
import authors from   "./data/author_connections.json"
import papers from   "./data/papers.json"

export const importGraphJSON = () => {
    return graph
}

export const importNeighborsJSON = () => {
    return neighbors
}

export const importAuthorsJSON = () => {
    return authors
}

export const importPapersJSON = () => {
    return papers
}

export const selectedNode = (state = {nodeID: 0 }, action) => {
    switch (action.type){
        case 'NODE_SELECTED': return {nodeID: action.nodeID }
        default: return state
    }
}