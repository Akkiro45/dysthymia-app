import { SWITCH_OP } from '../actions/actionTypes';

const initState = {
  loading: true,
  auth: true,
  init: true,
  tabs: true,
  welcome2: true
}

const reducer = (state=initState, action) => {
  switch(action.type) {
    case SWITCH_OP: return { ...state, [action.stackName]: action.value };
    default: return state;
  }
} 

export default reducer;