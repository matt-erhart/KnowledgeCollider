import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import * as reducers from './reducers';
import rootEpic from './epic'
import { reducer as formReducer } from 'redux-form'


const epicMiddleware = createEpicMiddleware(rootEpic);


const configureStore = () => {
  const middlewares = [thunk, epicMiddleware];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }

let rootReducer = combineReducers({
  graph: reducers.graph,
  activations: reducers.importActivationsJSON,
  activationSettings: reducers.activationSettings,
  selectedNodes: reducers.selectNodes,
  form: formReducer
})
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
};

export default configureStore;