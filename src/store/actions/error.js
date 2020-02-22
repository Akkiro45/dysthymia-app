import { SET_ERROR, RESET_ERROR } from './actionTypes';

export const setError = (error) => {
  return {
    type: SET_ERROR,
    error
  }
}

export const resetError = () => {
  return {
    type: RESET_ERROR
  }
}