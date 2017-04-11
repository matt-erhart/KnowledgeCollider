import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk';
import {importAuthorsJSON, importGraphJSON, importNeighborsJSON, importPapersJSON, selectedNode} from './reducers';

const configureStore = () => {
  const middlewares = [thunk];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }

let rootReducer = combineReducers({
  graph: importGraphJSON,
  authors: importAuthorsJSON,
  neighbors: importNeighborsJSON,
  papers: importPapersJSON,
  selectedNode
})
  return createStore(
    rootReducer,
    applyMiddleware(...middlewares)
  );
};

export default configureStore;
