import React from 'react';
import { ProgressDialog } from 'react-native-simple-dialogs';

import { PURPLE } from '../../../util/color';

const progressBox = (props) => {
  return (
    <ProgressDialog
      visible={props.visible}
      title={props.title}
      message={props.message}
      activityIndicatorColor={PURPLE}
      activityIndicatorSize='large'
      messageStyle={{ fontFamily: 'Rubik-Regular' }}
    />
  );
}

export default progressBox;