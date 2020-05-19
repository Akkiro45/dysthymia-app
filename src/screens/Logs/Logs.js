import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import Text from '../../components/UI/Text/Text';
import { GRAY2, BLUE } from '../../util/color';

class Logs extends Component {
  state = {
    lastUploadTime: 'None',
    lastErrorTime: 'None',
    error: 'None',
    setDataTime: 'None',
    sendTime: 'None'
  }
  componentDidMount() {
    let lastUploadTime = AsyncStorage.getItem('lastCalled');
    let sendTime = AsyncStorage.getItem('sendTime');
    let setDataTime = AsyncStorage.getItem('setDataTime');
    let error = AsyncStorage.getItem('uploadError');
    Promise.all([lastUploadTime, setDataTime, sendTime, error])
      .then((res) => {
        if(res[0]) {
          this.setState({ lastUploadTime: moment(parseInt(res[0])).format('dddd, MMMM Do YYYY, h:mm:ss a') });
        }
        if(res[1]) {
          this.setState({ setDataTime: moment(parseInt(res[1])).format('dddd, MMMM Do YYYY, h:mm:ss a') });
        }
        if(res[2]) {
          this.setState({ sendTime: moment(parseInt(res[2])).format('dddd, MMMM Do YYYY, h:mm:ss a') });
        }
        if(res[3]) {
          res[3] = JSON.parse(res[3]);
          this.setState({ error: JSON.stringify(res[3].error), lastErrorTime: moment(parseInt(res[3].time)).format('dddd, MMMM Do YYYY, h:mm:ss a') });
        } 
      })
      .catch(() => {
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      });
  }
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} >
        <Text text='Logs' type='h3' style={{ color: BLUE, marginVertical: 20 }} />
        <View style={{ width: '90%', alignSelf: 'center' }} >
          <View style={style.item} >
            <Text text='Upload Service' type='h6' style={style.name} numberOfLines={1} />
            <Text text={this.state.lastUploadTime} type='h5' style={style.value} numberOfLines={1} />
            <View style={style.divider} ></View>
          </View>
          <View style={style.item} >
            <Text text='Prepare Data' type='h6' style={style.name} numberOfLines={1} />
            <Text text={this.state.setDataTime} type='h5' style={style.value} numberOfLines={1} />
            <View style={style.divider} ></View>
          </View>
          <View style={style.item} >
            <Text text='Send Data' type='h6' style={style.name} numberOfLines={1} />
            <Text text={this.state.sendTime} type='h5' style={style.value} numberOfLines={1} />
            <View style={style.divider} ></View>
          </View>
          <View style={style.item} >
            <Text text='Last error recorded' type='h6' style={style.name} numberOfLines={1} />
            <Text text={this.state.lastErrorTime} type='h5' style={style.value} numberOfLines={1} />
            <View style={style.divider} ></View>
          </View>
          <View style={style.item} >
            <Text text='Last error' type='h6' style={style.name} numberOfLines={1} />
            <Text text={this.state.error} type='h5' style={style.value} numberOfLines={1} />
            <View style={style.divider} ></View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  item: {
    marginVertical: 10
  },  
  divider: {
    borderTopWidth: 1,
    borderColor: GRAY2,
    height: 0
  },
  name: {
    color: BLUE,
    textAlign: 'left'
  }, 
  value: {
    textAlign: 'left',
    marginVertical: 5,
    fontSize: 16
  }
});

export default Logs;