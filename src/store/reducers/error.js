import { SET_ERROR, RESET_ERROR } from '../actions/actionTypes';

const initState = {
  error: null
}

const reducer = (state=initState, action) => {
  switch(action.type) {
    case SET_ERROR: return { error: action.error };
    case RESET_ERROR: return { error: null };
    default: return state;
  }
} 

export default reducer;