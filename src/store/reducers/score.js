import { SET_SCORE } from '../actions/actionTypes';

const initState = {
  score: null,
  time: null,
  startDay: null,
  endDay: null
};

const reducer = (state=initState, action) => {
  switch(action.type) {
    case SET_SCORE: return { ...state, ...action };
    default: return state;
  }
}

export default reducer;