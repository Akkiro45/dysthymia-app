import React, { Component } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import Text from '../UI/Text/Text';

class TestComp extends Component {
  state = {
    lastUploadTime: 'None',
    lastErrorTime: 'None',
    error: 'None',
    setDataTime: 'None',
    testPendingData: 'None',
    callLogsErrorTime: 'None',
    callLogsError: 'None',
    sendTime: 'None'
  }
  componentDidMount() {
    AsyncStorage.getItem('lastCalled')
      .then(lastCalled => {
        if(lastCalled) {
          lastCalled = moment(parseInt(lastCalled)).format('dddd, MMMM Do YYYY, h:mm:ss a');
          this.setState({ lastUploadTime: lastCalled });
        }
      })
    AsyncStorage.getItem('uploadError')
      .then(uploadError => {
        if(uploadError) {
          uploadError = JSON.parse(uploadError);
          this.setState({ error: uploadError.error, lastErrorTime: moment(parseInt(uploadError.time)).format('dddd, MMMM Do YYYY, h:mm:ss a') });
        }
      })
    AsyncStorage.getItem('setDataTime')
      .then(setDataTime => {
        if(setDataTime) {
          setDataTime = moment(parseInt(setDataTime)).format('dddd, MMMM Do YYYY, h:mm:ss a');
          this.setState({ setDataTime: setDataTime });
        }
      })
    AsyncStorage.getItem('testPendingData')
      .then(testPendingData => {
        if(testPendingData) {
          // testPendingData = moment(parseInt(testPendingData)).format('dddd, MMMM Do YYYY, h:mm:ss a');
          this.setState({ testPendingData: testPendingData });
        }
      })
    AsyncStorage.getItem('callLogsError')
      .then(callLogsError => {
        if(callLogsError) {
          callLogsError = JSON.parse(callLogsError);
          this.setState({ callLogsError: callLogsError.error, callLogsErrorTime: moment(parseInt(callLogsError.time)).format('dddd, MMMM Do YYYY, h:mm:ss a') });
        }
      })
    AsyncStorage.getItem('sendTime')
      .then(sendTime => {
        if(sendTime) {
          sendTime = moment(parseInt(sendTime)).format('dddd, MMMM Do YYYY, h:mm:ss a');
          this.setState({ sendTime: sendTime });
        }
      })
  }
  render() {
    return (
      <View>
        <Text text='Last Upload service called' />
        <Text text={this.state.lastUploadTime} type='h6' />
        <Text text='setDataTime' />
        <Text text={JSON.stringify(this.state.setDataTime)} type='h6' />
        <Text text='sendTime' />
        <Text text={JSON.stringify(this.state.sendTime)} type='h6' />
        <Text text='callLogsError' />
        <Text text={JSON.stringify(this.state.callLogsError)} type='h6' />
        <Text text='callLogsErrorTime' />
        <Text text={JSON.stringify(this.state.callLogsErrorTime)} type='h6' />
        <Text text='testPendingData' />
        <Text text={JSON.stringify(this.state.testPendingData)} type='h6' />
        <Text text='Last Error' />
        <Text text={JSON.stringify(this.state.error)} type='h6' />
        <Text text='Last Error time' />
        <Text text={this.state.lastErrorTime} type='h6' />
      </View>
    );
  }
}

export default TestComp;