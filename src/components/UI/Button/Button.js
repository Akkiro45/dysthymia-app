import React from 'react';
import { View, TouchableNativeFeedback, Text, StyleSheet } from 'react-native';

const button = (props) => {
  const style = StyleSheet.create({
    button: {
      backgroundColor: '#2874ff',
      borderRadius: 4,
      width: '100%',
      height: '100%',
      justifyContent: 'center'
    },
    title: {
      color: '#fff',
      textAlign: 'center',
      fontSize: props.fontSize ? props.fontSize : 15
    }
  });
  return (
    <TouchableNativeFeedback onPress={props.onPress} >
      <View style={style.button} >
        <Text style={style.title} >{props.title}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}

export default button;