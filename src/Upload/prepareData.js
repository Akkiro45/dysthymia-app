import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import getUsageStats from '../services/UsageStats';
import getCallLogsStats from '../services/CallLogs';

import { generateUploadData } from './util';
import clearData from './clearData';

const prepareData = () => {
  AsyncStorage.getItem('time')
    .then(time => {
      if(time) {
        time = JSON.parse(time);
        if(time.endTime <= new Date().getTime()) {
          AsyncStorage.getItem('pendingData') 
            .then(pendingData => {
              let strData = '';
              if(pendingData) {
                pendingData = JSON.parse(pendingData);
                const usageStats = getUsageStats();
                const callLogs = getCallLogsStats(time.startTime);
                const receiver = AsyncStorage.getItem('receiver');
                Promise.all([receiver, usageStats, callLogs])
                  .then(res => {
                    pendingData.push(generateUploadData(res, time.startTime));
                    strData = JSON.stringify(pendingData);
                    AsyncStorage.setItem('pendingData', strData)
                      .then(() => {
                        // Clear Data
                        clearData(time.startTime, time.endTime);
                        time.startTime = parseInt(moment().startOf('day').format('x'));
                        time.endTime = parseInt(moment().endOf('day').format('x'));
                        AsyncStorage.setItem('time', JSON.stringify(time));
                      });
                  });
              } else {
                strData = JSON.stringify([]);
                AsyncStorage.setItem('pendingData', strData);
              }
            });
        }
      } else {
        const curr = {
          startTime: parseInt(moment().startOf('day').format('x')),
          endTime: parseInt(moment().endOf('day').format('x'))
        }
        AsyncStorage.setItem('time', JSON.stringify(curr));
      }
    })
    .catch(e => {
      console.log(e);
    });
}

export default prepareData;