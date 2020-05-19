import AsyncStorage from '@react-native-community/async-storage';

import axios from '../../../ml-axios';

import { SET_SCORE } from './actionTypes';
import { startLoading, stopLoading, setError } from './index';

export const setScore = (score, time, startDay, endDay) => {
  return {
    type: SET_SCORE,
    score,
    time,
    startDay,
    endDay
  }
}

export const storeScore = (scoreDigit, startDay, endDay, time) => {
  AsyncStorage.getItem('score')
    .then(score => {
      score = JSON.parse(score);
      if(!score) {
        score = {
          score: null,
          startDay: null,
          endDay: null,
          time: null
        }
      }
      score.score = scoreDigit;
      score.startDay = startDay;
      score.endDay = endDay;
      if(time) {
        score.time = time;
      }
      AsyncStorage.setItem('score', JSON.stringify(score));
    })  
    .catch(e => {
      console.log(e);
    })
}

export const getScore = (token) => {
  return dispatch => {
    const headers = {
      'x-auth': token
    }
    dispatch(startLoading());
    axios.get(`/?fromUser=1`, { headers })
      .then(response => {
        if(response) {
          if(response.data.status === 'ok') {
            dispatch(setScore(response.data.score, response.data.initialTime, response.data.startDay, response.data.endDay));
            storeScore(response.data.score, response.data.startDay, response.data.endDay, response.data.initialTime);
            dispatch(stopLoading());  
          } else {
            throw new Error('Error!');
          }
        } else {
          throw new Error('Error!');
        }
      })
      .catch(error => {
        // console.log(error);
        dispatch(stopLoading());
        if(error.response) {
          if(error.response.data.status === 'error') {
            dispatch(setError(error.response.data.error.msg));
          }
        } else {
          dispatch(setError('Something went wrong!'));
        }
      });
  }
}