import React from 'react';
import { TouchableNativeFeedback, View, Text, StyleSheet } from 'react-native';

import { PURPLE } from '../../../util/color';

const roundedButton = (props) => {
  const style = StyleSheet.create({
    button: {
      backgroundColor: PURPLE,
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30
    },
    text: {
      color: '#fff',
      fontFamily: 'Rubrick-Regular',
      fontSize: 18
    },
    container: {
      borderRadius: 30,
      overflow: 'hidden',
      elevation: 5
    }
  });
  return (
    <View style={style.container} >
      <TouchableNativeFeedback onPress={props.onPress} >
        <View style={[style.button, props.style]} >
          <Text style={[style.text, props.textStyle]} >
            {props.text}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

export default roundedButton;