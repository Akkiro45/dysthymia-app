import { SWITCH_OP, RESET_SWITCH } from './actionTypes';

export const switchOp = (stackName, value) => {
  return {
    type: SWITCH_OP,
    stackName,
    value
  }
}

export const resetSwitch = () => {
  return {
    type: RESET_SWITCH
  }
}
