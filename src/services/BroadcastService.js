import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import { receiverStorageStructure } from '../util/receiverStorageStructure';

const BroadcastService = async (data) => {
  AsyncStorage.getItem('receiver')
    .then(receiver => {
      if(!receiver) {
        receiver = {
          ...receiverStorageStructure
        }
      } else {
        receiver = JSON.parse(receiver);
      }
      const currDate = moment().format("DD/MM/YY");
      if(data.Event === 'ACTION_USER_PRESENT') {
        const unlock = {
          date: currDate,
          count: 1
        }
        if(receiver.unlocks.length === 0) {
          receiver.unlocks.push(unlock);
        } else {
          let curr = receiver.unlocks[receiver.unlocks.length - 1];
          if(curr.date === currDate) {
            receiver.unlocks[receiver.unlocks.length - 1].count = curr.count + 1;
          } else {
            receiver.unlocks.push(unlock);
          }
        }
        receiver.screenStartTime = new Date().getTime();
        receiver.isUnlocked = true;
      }
      if(data.Event === 'ACTION_SCREEN_OFF') {
        if(receiver.isUnlocked) {
          receiver.isUnlocked = false;
          let time = 0;
          if(receiver.screenStartTime) {
            time = new Date().getTime() - receiver.screenStartTime;
          }
          if(time < 0) {
            time = 0;
          }
          receiver.screenStartTime = 0;
          const screenOnTime = {
            date: currDate,
            time
          }
          if(receiver.screenOnTime.length === 0) {
            receiver.screenOnTime.push(screenOnTime);
          } else {
            let curr = receiver.screenOnTime[receiver.screenOnTime.length - 1];
            if(curr.date === currDate) {
              receiver.screenOnTime[receiver.screenOnTime.length - 1].time = curr.time + time;
            } else {
              receiver.screenOnTime.push(screenOnTime);
            }
          }
        }
      }
      if(data.Event === 'ACTION_HEADSET_PLUG') {
        const headsetPlug = {
          date: currDate,
          count: 1
        }
        if(receiver.headsetPlug.length === 0) {
          receiver.headsetPlug.push(headsetPlug);
        } else {
          let curr = receiver.headsetPlug[receiver.headsetPlug.length - 1];
          if(curr.date === currDate) {
            receiver.headsetPlug[receiver.headsetPlug.length - 1].count = curr.count + 1;
          } else {
            receiver.headsetPlug.push(headsetPlug);
          }
        }
      }
      AsyncStorage.setItem('receiver', JSON.stringify(receiver));
    })
    .catch(e => {
      console.log("Unable to read receiver from AsyncStorage.");
    });
}

export default BroadcastService;