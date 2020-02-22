import React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';

const box = (props) => {
  const style = StyleSheet.create({
    box: {
      width: '90%',
      height: 120,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: props.borderColor,
      alignSelf: 'center',
      marginVertical: 5,
      alignItems: 'center'
    },
    title: {
      color: '#fff',
      fontSize: 20,
      marginBottom: 5
    },
    value: {
      color: '#fff',
      fontSize: 50
    }
  });
  const ren = (
    <View style={style.box} >
      <Text style={style.title} >{props.title}</Text>
      <Text style={style.value} >{props.value}</Text>
    </View>
  );
  if(props.clickable) {
    return (
      <TouchableNativeFeedback onPress={props.onPress} >
        {ren}
      </TouchableNativeFeedback>
    );
  } else {
    return ren;
  }
}

export default box;
