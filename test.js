import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import { getObjByDate, generateLightData, generateActivityData, generateKeysByHalfHoure } from './src/Upload/util';

const test = async () => {
  const time = await AsyncStorage.getItem('time');
  const pendingData = await AsyncStorage.getItem('pendingData');
  const receiver = await AsyncStorage.getItem('receiver');
  console.log(new Date(JSON.parse(time).startTime));
  console.log(JSON.parse(pendingData));
  console.log(JSON.parse(receiver));

  // const obj = {
  //   startTime: parseInt(moment(1581967800000).startOf('day').format('x')),
  //   endTime: parseInt(moment(1581967800000).endOf('day').format('x'))
  // }
  // AsyncStorage.setItem('time', JSON.stringify(obj));

  // clearData();
  // console.log(getObjByDate(JSON.parse(receiver).notifications, JSON.parse(receiver).notifications[0].date))

  // for(let i=1;i<=48;i++) {
  //   console.log(generateKeysByHalfHoure(i));
  // }

  // console.log(generateLightData(JSON.parse(receiver).lightSensor, new Date().getTime()))
  
  // let r = JSON.parse(receiver);
  // r.stepCounter[0].steps = 1800
  // AsyncStorage.setItem('receiver', JSON.stringify(r));

  // console.log(moment.utc(1582556720893).millisecond());
}

export default test;