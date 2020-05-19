import AsyncStorage from '@react-native-community/async-storage';

import axios from '../../../axios';
import { AUTH_SUCCESS, SIGNOUT } from './actionTypes';
import { startLoading, stopLoading, setError, switchOp, resetSwitch, setScore } from './index';
import Heartbeat from '../../../Heartbeat';

export const authSuccess = (data) => {
  return {
    type: AUTH_SUCCESS,
    data
  }
}

export const signout = () => {
  return {
    type: SIGNOUT,
  }
}

export const onSignout = (token) => {
  return dispatch => {
    AsyncStorage.removeItem('auth');
    AsyncStorage.removeItem('score');
    const headers = {
      'x-auth': token
    }
    axios.delete('/user/signout', { headers })
      .then(() => {
        console.log('Signout');
      })
      .catch(() => {
        console.log('Not Signout');
      });
      dispatch(setScore(null, null, null, null));
      dispatch(resetSwitch());
      dispatch(signout());
  }
}

export const auth = (data, isSignin, navigation) => {
  return dispatch => {
    dispatch(startLoading());
    const URL = isSignin ? '/user/signin' : '/user/signup';
    axios.post(URL, data)
      .then(res => {
        const data = {
          token: res.headers['x-auth'],
          data: res.data.data
        } 
        Heartbeat.startService();
        dispatch(authSuccess(data));
        AsyncStorage.setItem('auth', JSON.stringify(data));
        dispatch(stopLoading());
        if(data.data.profile) {
          if(data.data.profile.profileEmoji) {
            if(data.data.profile.emailIds) {
              if(data.data.profile.emailIds.length > 0) {
                navigation.navigate('Tabs');
              } else {
                navigation.navigate('Init', { redirect: true });  
              }
            } else {
              navigation.navigate('Init', { redirect: true });
            }
          } else {
            navigation.navigate('Init', { redirect: false });
          }
        } else {
          navigation.navigate('Init', { redirect: false });
        }
        dispatch(switchOp('auth', false));
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

export const autoSignin = () => {
  return dispatch => {
    AsyncStorage.getItem('auth')
    .then(auth => {
      if(auth) {
        auth = JSON.parse(auth);
        if(auth.data && auth.token) {
          dispatch(authSuccess(auth));
        }
      }
    })
    .catch(e => {
      dispatch(signout());
    })
  }
}

export const postProfile = (profileData, token, navigation) => {
  return dispatch => {
    dispatch(startLoading());
    const headers = {
      'x-auth': token
    }
    axios.post('/user/profile', profileData, { headers })
      .then(response => {
        if(response) {
          if(response.data.status === 'ok') {
            const data = {
              token: token,
              data: response.data.data
            } 
            dispatch(authSuccess(data));
            AsyncStorage.setItem('auth', JSON.stringify(data));
            dispatch(stopLoading());
            navigation.navigate('Welcome2');
            dispatch(switchOp('init', false));
          } else {
            throw new Error('Error!');
          }
        } else {
          throw new Error('Error!');
        }
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