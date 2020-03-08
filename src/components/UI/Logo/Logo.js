import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

import Logo from '../../../assets/Images/Logo.png';
import { LIGHT_PURPLE } from '../../../util/color';

const logo = (props) => {
  const style = StyleSheet.create({
    logo: {
      backgroundColor: LIGHT_PURPLE,
      width: Dimensions.get('screen').width / 2,
      height: Dimensions.get('screen').width / 2,
      alignSelf: 'center',
      borderRadius: Dimensions.get('screen').width / 2,
      marginVertical: 5,
      padding: 20
    }
  });
  return (
    <View style={[style.logo, props.style]} >
      <Image 
        source={Logo}
        style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
      />
    </View>
  );
}

export default logo;