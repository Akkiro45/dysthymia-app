import { START_LOADING, STOP_LOADING } from '../actions/actionTypes';

const initState = {
  loading: false
};

const reducer = (state=initState, action) => {
  switch(action.type) {
    case START_LOADING: return { loading: true };
    case STOP_LOADING: return { loading: false };
    default: return state;
  }
}

export default reducer;