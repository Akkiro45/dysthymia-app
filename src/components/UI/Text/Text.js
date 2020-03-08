import React from 'react';
import { Text, StyleSheet } from 'react-native';

const getFontSize = (type) => {
  if(type === 'h1') return 40;
  else if(type === 'h2') return 35;
  else if(type === 'h3') return 30;
  else if(type === 'h4') return 25;
  else if(type === 'h5') return 20;
  else if(type === 'h6') return 15;
  else return 20
}

const text = (props) => {
  const style = StyleSheet.create({
    text: {
      textAlign: 'center',
      color: '#000',
      fontSize: getFontSize(props.type),
      fontFamily: 'Rubik-Regular'
    }
  });
  return (
    <Text style={[style.text, props.style]} numberOfLines={props.numberOfLines} >{props.text}</Text>
  );
}

export default text;