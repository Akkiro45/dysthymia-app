import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback, ActivityIndicator } from 'react-native';

import Text from '../../UI/Text/Text';
import { BLUE, PURPLE } from '../../../util/color';

const style = StyleSheet.create({
  container: {
    width: '90%',
    height: 160,
    backgroundColor: '#fff',
    elevation: 15,
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'center'
  },
  header: {
    // backgroundColor: 'green',
    height: 40,
    justifyContent: 'center'
  },
  contents: {
    // backgroundColor: 'yellow',
    height: 120
  },
  box: {
    height: '100%',
    width: '49%',
    // backgroundColor: 'red',
    justifyContent: 'center'
  },
  saperator: {
    height: 100,
    borderLeftWidth: 1,
    borderLeftColor: '#eee'
  }
});

const workout = (props) => {
  let content = null;
  if(props.data) {
    content = (
      <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }} >
        <View style={style.box} >
          <Text text={props.cal} type='h3' numberOfLines={1} style={{ marginBottom: 10 }} />
          <Text text='Cal' type='h6' style={{ fontFamily: 'Rubik-Light' }} />
        </View>
        <View style={style.saperator} ></View>
        <View style={style.box} >
          <Text text={props.km} type='h3' numberOfLines={1} style={{ marginBottom: 10 }} />
          <Text text='km' type='h6' style={{ fontFamily: 'Rubik-Light' }} />
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
    <View style={style.container} >
      <TouchableNativeFeedback onPress={props.onPress} >
        <View style={{ flex: 1 }} >
          <View style={style.header} >
            <Text text='Workout' type='h5' style={{ color: BLUE, fontFamily: 'Rubik-Medium' }} />
          </View>
          <View style={style.contents} >
            {content}
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
} 

export default workout;