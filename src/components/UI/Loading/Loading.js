import React from 'react';
import { View } from 'react-native';

import Spinner from '../Spinner/Spinner';
import Text from '../Text/Text';
import { PURPLE } from '../../../util/color';

const loading = () => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
      <Text text='Loading...' type='h4' style={{ color: PURPLE, marginBottom: 30, fontFamily: 'Rubik-Medium' }} />
      <Spinner
        isVisible={true} 
        size={150}
      />
    </View>
  );
}

export default loading;