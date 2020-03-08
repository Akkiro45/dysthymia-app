import React from 'react';
import Spinner from 'react-native-spinkit';

import { PURPLE } from '../../../util/color';

const spinner = (props) => {
  const options = {
    isVisible: false,
    color: PURPLE,
    size: 100,
    type: 'Bounce',
    style: {
      alignSelf: 'center'
    },
    ...props
  }
  return (
    <Spinner 
      {...options}  
    />
  );
}

export default spinner;