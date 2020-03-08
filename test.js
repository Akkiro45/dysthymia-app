import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import { NativeModules } from 'react-native';
const UsageStats = NativeModules.UsageStats;

import { getObjByDate, generateLightData, generateActivityData, generateKeysByHalfHoure } from './src/Upload/util';

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
  
}

export default test;