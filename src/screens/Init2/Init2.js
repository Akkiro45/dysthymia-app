import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Emoji from 'react-native-emoji';

import { PURPLE, LIGHT_PURPLE } from '../../util/color';
import Button from '../../components/UI/RoundedButton/RoundedButton';
import Text from '../../components/UI/Text/Text';
import emojisList from '../../util/emojis';

class Init2 extends Component {
  onContinue = () => {
    // console.log(this._carousel.currentIndex);
    const { gender } = this.props.route.params;
    this.props.navigation.navigate('Init3', { gender, profileEmoji: emojisList[this._carousel.currentIndex] });
  }
  _renderItem = ({item, index}) => {
    return (
        <View style={style.slide}>
            <Emoji name={item.key} style={{fontSize: 60}} />
        </View>
    );
  }
  render() {
    const data = emojisList.map((i) => {
      return {
        key: i
      }
    });
    return (
      <View style={style.container} >
        <View style={style.header}>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
          <View style={style.box} ></View>
        </View>
        <View style={style.body}>
          <View style={style.emojis}>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={data}
              renderItem={this._renderItem}
              sliderWidth={Dimensions.get('screen').width}
              itemWidth={110}
              loop={true}
              loopClonesPerSide={5}
              inactiveSlideScale={0.7}
            />
          </View>
          <Text text='Profile Picture' type='h3' style={{ marginVertical: 10, fontFamily: 'Rubik-Medium' }} />
          <Text text='You can select photo from one of these emoji.' type='h6' style={{ fontFamily: 'Rubik-Light', width: '60%' }} />
        </View>
        <View style={style.footer}>
          <View style={style.button} >
            <Button text='Continue' onPress={this.onContinue} />
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    // backgroundColor: 'yellow',
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    // backgroundColor: 'green',
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center'
  },
  footer: {
    // backgroundColor: 'blue',
    flex: 1,
    justifyContent: 'center'
  },
  box: {
    backgroundColor: LIGHT_PURPLE,
    width: '30%',
    height: 12,
    marginHorizontal: 5
  },
  button: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    marginVertical: 15
  },
  emojis: {
    // backgroundColor: 'yellow',
    width: '100%',
    height: 150,
    // paddingTop: 10
  },
  slide: {
    width: 95,
    height: 95,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 50,
    elevation: 10,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Init2;