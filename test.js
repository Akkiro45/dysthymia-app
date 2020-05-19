import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import { NativeModules } from 'react-native';
const UsageStats = NativeModules.UsageStats;

import { getObjByDate, generateLightData, generateActivityData, generateKeysByHalfHoure } from './src/Upload/util';

import getScore from './src/Upload/getScore';
import upload from './src/Upload/upload';

const test = async () => {
  // const time = await AsyncStorage.getItem('auth');
  // const pendingData = await AsyncStorage.getItem('pendingData');
  // const receiver = await AsyncStorage.getItem('receiver');
  // console.log(JSON.parse(time));
  // console.log(JSON.parse(pendingData));
  // console.log(JSON.parse(receiver));
  
  // arr = ['BG Service', 'Twitter']
  // UsageStats.getAppsIcon(arr.toString(), (data) => {
  //   console.log(data);
  // });
  // getScore();
  // AsyncStorage.removeItem('score');

  AsyncStorage.getItem('lastCalled')
    .then(lastCalled => {
      if(lastCalled) {
        lastCalled = moment(parseInt(lastCalled)).format('dddd, MMMM Do YYYY, h:mm:ss a');
        console.log(lastCalled);
      }
    })
  AsyncStorage.getItem('uploadError')
    .then(uploadError => {
      console.log(JSON.parse(uploadError))
      if(uploadError) {
        uploadError = JSON.parse(uploadError);
        // this.setState({ error: uploadError.error, lastErrorTime: moment(parseInt(uploadError.time)).format('dddd, MMMM Do YYYY, h:mm:ss a') });
        console.log('error');
        console.log(moment(parseInt(uploadError.time)).format('dddd, MMMM Do YYYY, h:mm:ss a'))
        console.log(uploadError.error)
      }
    })
}

export default test;