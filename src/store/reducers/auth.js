import { AUTH_SUCCESS, SIGNOUT } from '../actions/actionTypes';
import { updateObject } from '../../util/util';

const initState = {
  token: null,
  data: null
};

const reducer = (state=initState, action) => {
  switch(action.type) {
    case AUTH_SUCCESS: return updateObject(state, action.data);
    case SIGNOUT: return updateObject(state, { token: null, data: null });
    default: return state;
  }
}

export default reducer;