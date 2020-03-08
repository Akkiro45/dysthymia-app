import { SWITCH_OP } from './actionTypes';

export const switchOp = (stackName, value) => {
  return {
    type: SWITCH_OP,
    stackName,
    value
  }
}
