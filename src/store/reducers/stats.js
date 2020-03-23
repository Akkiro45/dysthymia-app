import { CLEAN_STATS, FETCHED_STATS_DONE } from '../actions/actionTypes';

const initState = {
  stats: [],
  isFinished: false,
  pageNumber: 1,
  pageSize: 30
}

const reducer = (state=initState, action) => {
  switch(action.type) {
    case CLEAN_STATS: return { ...initState };
    case FETCHED_STATS_DONE: return { ...state, stats: state.stats.concat(action.stats), isFinished: action.isFinished, pageNumber: action.pageNumber };
    default: return state;
  }
} 

export default reducer;