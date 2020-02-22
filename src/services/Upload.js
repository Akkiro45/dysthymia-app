import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";

import axios from '../../axios';
import getUsageStats from './UsageStats';
import getCallLogsStats from './CallLogs';

const getObjByDate = (arr, date) => {
  for(let i=arr.length - 1; i>=0; i--) {
    if(arr[i].date === date) {
      return arr[i];
    }
  }
}
const getArrayByTime = (arr, time) => {
  let tempArray = [];
  if(typeof(time) === 'string') {
    for(let i=arr.length - 1; i>=0; i--) {
      if(arr[i].time === time) {
        tempArray.push(arr[i]);
      } 
    }
  } else {
    const start = parseInt(moment(time).startOf('day').format('x'));
    const end = parseInt(moment(time).endOf('day').format('x'));
    for(let i=arr.length - 1; i>=0; i--) {
      if((start <= arr[i].time) && (end >= arr[i].time)) {
        tempArray.push(arr[i]);
      } 
    }
  }
  
  return tempArray;
}

const generateUploadData = (arr, time) => {
  const currDate = moment(time).format("DD/MM/YY");
  let data = {};
  data.usageStats = {
    date: currDate,
    stats: arr[1]
  }
  data.callStats = {
    date: currDate,
    stats: arr[2]
  }
  const receiver = JSON.parse(arr[0]);
  data.unlocks = getObjByDate(receiver.unlocks, currDate);
  data.screenOnTime = getObjByDate(receiver.screenOnTime, currDate);
  data.notifications = getObjByDate(receiver.notifications, currDate);
  data.headsetPlug = getObjByDate(receiver.headsetPlug, currDate);
  data.activities = getArrayByTime(receiver.activities, time);
  return data;
}

// const upload = async () => {
//   const time = await AsyncStorage.getItem('time');
//   const pendingData = await AsyncStorage.getItem('pendingData');
//   console.log(new Date(JSON.parse(time).startTime));
//   // console.log(pendingData); 
// }

const upload = async () => {
  console.log('Service!');    

  // Preparing Data
  prepareData();
  
  // Sending Data
  // sendData();

  // oneTimeSend()

}

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
                        time.startTime = parseInt(moment().startOf('day').format('x'));
                        time.endTime = parseInt(moment().endOf('day').format('x'));
                        AsyncStorage.setItem('time', JSON.stringify(time));
                      })
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

const sendData = () => {
  NetInfo.fetch().then(state => {
    if(state.isInternetReachable) {
      let strData;
      AsyncStorage.getItem('pendingData') 
        .then(pendingData => {
          if(pendingData) {
            pendingData = JSON.parse(pendingData);
            if(pendingData.length > 0) {
              console.log('Got data!');
              AsyncStorage.getItem('auth')
                .then(auth => {
                  if(auth) {
                    auth = JSON.parse(auth);
                    const  headers = {
                      'x-auth': auth.token
                    }
                    const body = {
                      stats: pendingData[0]
                    }
                    console.log('Start Sending');
                    axios.post('/stats/post', body, {headers})
                      .then(res => {
                        if(res.data.status === 'ok') {
                          console.log('done')
                          // pendingData.shift();
                          // strData = JSON.stringify(pendingData);
                          // AsyncStorage.setItem('pendingData', strData);
                        }
                      })
                      .catch(err => {
                        console.log(err.response);
                      });
                  }
                });
            }
          } else {
            strData = JSON.stringify([]);
            AsyncStorage.setItem('pendingData', strData);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  });
}


const oneTimeSend = () => {
  AsyncStorage.getItem('oneTime')
    .then(oneTime => {
      if(!oneTime) {
        AsyncStorage.getItem('receiver')
          .then(receiver => {
            if(receiver) {
              receiver = JSON.parse(receiver);
              const data = {
                // activities: receiver.activities,
                headsetPlug: receiver.headsetPlug,
                notifications: receiver.notifications,
                screenOnTime: receiver.screenOnTime,
                unlocks: receiver.unlocks
              }
              NetInfo.fetch().then(state => {
                if(state.isInternetReachable) {
                  console.log('Start sending')
                  AsyncStorage.getItem('auth')
                    .then(auth => {
                      if(auth) {
                        auth = JSON.parse(auth);
                        const  headers = {
                          'x-auth': auth.token
                        }
                        const body = {
                          stats: data
                        }
                        axios.post('/stats/post-one-time', body, {headers})
                          .then(res => {
                            console.log(res)
                            if(res.data.status === 'ok') {
                              AsyncStorage.setItem('oneTime', 'done');
                            }
                          })
                          .catch(err => {
                            console.log(err.response);
                          });
                      }    
                    });
                }
              })
            }
          })   
      }
    });
}

export default upload;