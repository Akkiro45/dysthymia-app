import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/dist/Entypo';
import Emoji from 'react-native-emoji';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import LEVELS from '../../util/scoreLevels';
import Text from '../UI/Text/Text';
import { BLUE, GRAY1, LIGHT_PURPLE } from '../../util/color';
import { TRIANGLE_DOWN, TRIANGLE_UP } from '../../util/icons';

const scoreBoard = (props) => {
  let currLevel = 0;
  let currColor = LIGHT_PURPLE;
  let scoreString = props.score;
  if(props.score < 10) {
    scoreString = '0' + props.score;
  }
  LEVELS.forEach((e, i) => {
    if(props.score >= e.startLimit && props.score <= e.endLimit) {
      currLevel = i;
      currColor = e.color;
    }
  });
  return (
    <View style={style.container} >
      <Text text={LEVELS[currLevel].msg1} type='h5' style={{ textAlign: 'left', fontFamily: 'Rubik-Light' }} />
      <Text text={LEVELS[currLevel].msg2} type='h5' style={{ textAlign: 'left', fontFamily: 'Rubik-Light' }} />
      <View style={{ alignItems: 'center', marginVertical: 40 }} > 
        <AnimatedCircularProgress
          size={220}
          width={12}
          fill={(props.score * 100) / 24}
          rotation={240}
          arcSweepAngle={240}
          lineCap={'round'}
          tintColor={currColor}
          backgroundColor={LIGHT_PURPLE} >
            {
            (fill) => (
              <View>
                <Text text={'Score'} type='h4' />
                <Text text={scoreString} type='h1' style={{ fontSize: 55, marginTop: 10, fontFamily: 'Rubik-Medium' }} />
              </View>
            )
          }
        </AnimatedCircularProgress>
      </View>
      <Text text='Depression Status' type='h5' style={{ color: BLUE, fontSize: 23 }} />
      <View style={style.divider} ></View>
      <View style={style.emojis} >
        {LEVELS.map((e, i) => {
          return (
            <View style={style.item} key={i + e.emoji} >
              <View style={style.icon} >
                {currLevel === i ? (<Icon name={TRIANGLE_DOWN} size={35} color={GRAY1} />) : null }
              </View>
              <View style={style.emoji} >
                <Emoji name={e.emoji} style={{fontSize: 45}} />
              </View>
              <View style={style.icon} >
                {currLevel === i ? (<Icon name={TRIANGLE_UP} size={35} color={GRAY1} />) : null }
              </View>
            </View>
          );
        })}
      </View>
      <View style={style.buttonContainer} >
        <TouchableNativeFeedback onPress={props.onPress} >
          <View style={style.button} >
            <Text text='Get new Score' style={{ color: '#fff' }} />
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center'
  },
  divider: {
    width: '75%',
    borderTopWidth: 1,
    borderTopColor: GRAY1,
    alignSelf: 'center',
    marginVertical: 15
  },
  emojis: {
    height: 120,
    // backgroundColor: GRAY1,
    flexDirection: 'row'
  },
  item: {
    width: '20%',
    height: '100%',
    // backgroundColor: '#eee',
    flexDirection: 'column'
  },
  icon: {
    width: '100%',
    height: 30,
    // backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emoji: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: BLUE,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    width: 250,
    height: 50,
    alignSelf: 'center',
    marginVertical: 25
  }
});

export default scoreBoard;