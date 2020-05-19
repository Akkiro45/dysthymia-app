import React, { Component } from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { WheelPicker } from "react-native-wheel-picker-android";
import { Dialog } from 'react-native-simple-dialogs';

import { PURPLE, LIGHT_PURPLE, GRAY2 } from '../../util/color';
import Button from '../../components/UI/RoundedButton/RoundedButton';
import Text from '../../components/UI/Text/Text';
import { height, weight } from '../../util/heightAndWeight';
import { month, year, getDays } from '../../util/date';
import { convHeightStrToFootInt } from '../../util/util';

class Init3 extends Component {
  state = {
    dob: null,
    weight: null,
    height: null,
    show: false,
    type: '',
    day: 0,
    month: 0,
    year: 0
  }
  
  onContinue = () => {
    if(this.state.dob !== null && this.state.height !== null && this.state.weight !== null) {
      const data = {
        gender: this.props.route.params.gender,
        profileEmoji: this.props.route.params.profileEmoji,
        dob: {
          day: this.state.day + 1,
          month: parseInt(month[this.state.month]),
          year: parseInt(year[this.state.year])
        },
        weight: parseInt(weight[this.state.weight].substring(0, weight[this.state.weight].length - 3)),
        height: convHeightStrToFootInt(height[this.state.height])
      }
      this.props.navigation.navigate('Init4', { data });
    } else {
      this.props.onSetError('Please select all the fields!');
    }
  }

  onItemSelected = (selectedItem, type) => {
    if(type === 'day' || type === 'month' || type === 'year') {
      const day = this.state.day < 9 ? '0'+ (this.state.day + 1) : (this.state.day + 1).toString();
      const dob = day + '-' + month[this.state.month] + '-' + year[this.state.year]
      this.setState({ [type]: selectedItem, dob });
    } else {
      this.setState({ [type]: selectedItem });
    }
  }
  onClick = (type) => {
    this.setState({ type, show: true });
  }
  showDialoBoxHandler = () => {
    this.setState(prevState => {
      return { show: !prevState.show };
    });
  }
  render() {
    let dialogboxContent = null;
    const type = this.state.type;
    if(type === 'weight' || type === 'height') {
      dialogboxContent = (
        <View>
          <Text text={type === 'weight' ? 'Weight' : 'Height'} type='h4' style={{ marginVertical: 10 }} />
          <View style={style.picker} >
            <WheelPicker
              selectedItem={type === 'weight' ? this.state.weight : this.state.height}
              data={type === 'weight' ? weight : height}
              onItemSelected={(selectedItem) => this.onItemSelected(selectedItem, type)}
              style={{ height: '100%', height: '100%' }}
            />
          </View>
        </View>
      );
    } else {
      dialogboxContent = (
        <View style={{ marginVertical: 10 }} >
          <Text text={'Year born'} type='h4' style={{ marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', alignSelf: 'center' }} >
            <View style={[style.picker, { width: '30%' }]} >
              <Text text={'Day'} type='h5' style={{ marginVertical: 5 }} />
              <WheelPicker
                selectedItem={this.state.day}
                data={getDays(this.state.month + 1, year[this.state.year])}
                onItemSelected={(selectedItem) => this.onItemSelected(selectedItem, 'day')}
                style={{ height: '100%', height: '100%' }}
              />
            </View>
            <View style={[style.picker, { width: '30%' }]} >
              <Text text={'Month'} type='h5' style={{ marginVertical: 5 }} />
              <WheelPicker
                selectedItem={this.state.month}
                data={month}
                onItemSelected={(selectedItem) => this.onItemSelected(selectedItem, 'month')}
                style={{ height: '100%', height: '100%' }}
              />
            </View>
            <View style={[style.picker, { width: '32%' }]} >
              <Text text={'Year'} type='h5' style={{ marginVertical: 5 }} />
              <WheelPicker
                selectedItem={this.state.year}
                data={year}
                onItemSelected={(selectedItem) => this.onItemSelected(selectedItem, 'year')}
                style={{ height: '100%', height: '100%' }}
              />
            </View>
          </View>

        </View>
      );
    }
    return (
      <View style={style.container} >
        <Dialog
          visible={this.state.show}
          animationType={'fade'}
          onTouchOutside={this.showDialoBoxHandler} >
          <View>
            {dialogboxContent}
          </View>
        </Dialog>
        <View style={style.header}>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
          <View style={[style.box, { backgroundColor: PURPLE }]} ></View>
          <View style={style.box} ></View>
        </View>
        <View style={style.body}>
          <View style={style.title} >
            <Text text='About You' type='h3' style={{ fontFamily: 'Rubik-Medium' }} />
          </View>
          <View style={style.controls} >

            <View style={style.control} >
              <Text text='Year born' type='h5' style={{ fontFamily: 'Rubik-Medium', textAlign: 'left' }} />
              <TouchableNativeFeedback onPress={() => this.onClick('dob')} >
                <View style={style.showCase} >
                  <Text text={this.state.dob ? this.state.dob : 'click me'} type='h5' style={{ textAlign: 'left' }} />
                </View>
              </TouchableNativeFeedback>
            </View>

            <View style={style.control} >
              <Text text='Weight' type='h5' style={{ fontFamily: 'Rubik-Medium', textAlign: 'left' }} />
              <TouchableNativeFeedback onPress={() => this.onClick('weight')} >
                <View style={style.showCase} >
                  <Text text={this.state.weight !== null ? weight[this.state.weight] : 'click me'} type='h5' style={{ textAlign: 'left' }} />
                </View>
              </TouchableNativeFeedback>
            </View>

            <View style={style.control} >
              <Text text='Height' type='h5' style={{ fontFamily: 'Rubik-Medium', textAlign: 'left' }} />
              <TouchableNativeFeedback onPress={() => this.onClick('height')} >
                <View style={style.showCase} >
                  <Text text={this.state.height !== null ? height[this.state.height] : 'click me'} type='h5' style={{ textAlign: 'left' }} />
                </View>
              </TouchableNativeFeedback>
            </View>

          </View>
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
    // justifyContent: 'center',
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
    width: '20%',
    height: 12,
    marginHorizontal: 5
  },
  button: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    marginVertical: 15
  },
  title: {
    // backgroundColor: 'red',
    height: 50,
    justifyContent: 'center'
  },
  controls: {
    // backgroundColor: 'yellow',
    width: '90%',
    justifyContent: 'center',
    flex: 1
  },
  control: {
    marginVertical: 10
  },
  showCase: {
    borderWidth: 1,
    borderColor: GRAY2,
    elevation: 10,
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 5
  },
  picker: {
    width: 175,
    height: 130,
    alignSelf: 'center',
    // backgroundColor: 'red'
  }
});

export default Init3;