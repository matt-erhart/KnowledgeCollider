import { combineEpics } from 'redux-observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineAll';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';

const debounceInput = action$ =>
  action$.ofType("SET_TOP_N_ACTIVATIONS$")
    .debounceTime(1000)// Asynchronously wait 1000ms then continue
    .map(action => ({ type: 'SET_TOP_N_ACTIVATIONS', topN: action.topN }))
    .do(action => console.log('action',action))


export default combineEpics(debounceInput);