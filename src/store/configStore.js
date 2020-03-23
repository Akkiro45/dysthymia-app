import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import loadingReducer from '../store/reducers/loading';
import errorReducer from '../store/reducers/error';
import authReducer from '../store/reducers/auth';
import switchNavigatorReducer from '../store/reducers/switchNavigator';
import statsReducer from '../store/reducers/stats';
import scoreReducer from './reducers/score';

const rootReducer = combineReducers({
  loading: loadingReducer,
  error: errorReducer,
  auth: authReducer,
  switchNavigator: switchNavigatorReducer,
  stats: statsReducer,
  score: scoreReducer
});

let composeEnhancers = compose;

if(__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configStore;