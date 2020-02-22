import AsyncStorage from '@react-native-community/async-storage';

import axios from '../../../axios';
import { AUTH_SUCCESS, SIGNOUT } from './actionTypes';
import { startLoading, stopLoading, setError } from './index';

export const authSuccess = (data) => {
  return {
    type: AUTH_SUCCESS,
    data
  }
}

export const signout = (data) => {
  return {
    type: SIGNOUT,
  }
}

export const auth = (data, isSignin) => {
  return dispatch => {
    dispatch(startLoading());
    const URL = isSignin ? '/user/signin' : '/user/signup';
    axios.post(URL, data)
      .then(res => {
        const data = {
          token: res.headers['x-auth'],
          data: res.data.data
        } 
        dispatch(authSuccess(data));
        AsyncStorage.setItem('auth', JSON.stringify(data));
        dispatch(stopLoading());
      })
      .catch(error => {
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