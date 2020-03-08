import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback, ActivityIndicator } from 'react-native';

import { BLUE, PURPLE } from '../../../util/color';
import Text from '../../UI/Text/Text';

const style = StyleSheet.create({
  container: {
    width: '45%',
    height: 200,
    backgroundColor: '#fff',
    elevation: 15,
    marginVertical: 15,
    borderRadius: 15,
    overflow: 'hidden'
  },
  header: {
    // backgroundColor: 'red',
    height: 70,
    width: '95%',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  contents: {
    // backgroundColor: 'blue',
    height: 130,
    width: '95%',
    alignSelf: 'center'
  },
  content: {
    // backgroundColor: 'yellow',
    height: 60
  },
  label: {
    // backgroundColor: 'green',
    height: 30,
    justifyContent: 'center'
  }
});

const card = (props) => {
  let content = null;
  if(props.data) {
    content = (
      <View style={{ flex: 1, justifyContent: 'center' }} >
        <View style={style.content} >
          {props.children}
        </View>
        <View style={style.label} >
          <Text text={props.label} type='h6' style={{ fontFamily: 'Rubik-Light' }} numberOfLines={1} />
        </View>
      </View>
    );
  } else {
    content = (
      <View style={{ flex: 1, justifyContent: 'center' }} >
        <ActivityIndicator size="large" color={PURPLE} />
      </View>
    );
  }
  return (
    <View style={[style.container, props.left ? { marginRight: 16 } : { marginLeft: 16 }]} >
      <TouchableNativeFeedback onPress={props.onPress} >
        <View style={{ flex: 1 }} >
          <View style={style.header}>
            <Text text={props.title} type='h6' style={{ color: BLUE, fontFamily: 'Rubik-Medium' }} numberOfLines={2} />
          </View>
          <View style={style.contents} >
            {content}
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

export default card;