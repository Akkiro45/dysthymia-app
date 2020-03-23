import axios from '../../../axios';

import { FETCHED_STATS_DONE, CLEAN_STATS } from './actionTypes';
import { startLoading, stopLoading, setError } from './index';
import { transformStats } from '../../util/tranformStats';

export const cleanStats = () => {
  return {
    type: CLEAN_STATS
  }
}

export const fetchStatsDone = (stats, isFinished, pageNumber) => {
  return {
    type: FETCHED_STATS_DONE,
    stats,
    isFinished,
    pageNumber
  }
}

export const fetchStats = (pageNumber, pageSize, type, token, initialData) => {
  return dispatch => {
    dispatch(startLoading());
    const headers = {
      'x-auth': token
    }
    axios.get(`/stats/${type}?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers })
      .then(response => {
        if(response) {
          if(response.data.status === 'ok') {
            const data = transformStats(response.data.data, initialData);
            dispatch(fetchStatsDone(data, response.data.data.length < pageSize, pageNumber + 1));
            dispatch(stopLoading());
          } else {
            throw new Error('Error!');
          }
        } else {
          throw new Error('Error!');
        }
      })
      .catch(error => {
        if(error.response) {
          if(error.response.data.status === 'error') {
            const data = transformStats([], initialData);
            dispatch(fetchStatsDone(data, true, pageNumber + 1));
            // dispatch(setError(error.response.data.error.msg));
          }
        } else {
          dispatch(setError('Something went wrong!'));
        }
        dispatch(stopLoading());
      });
  }
}