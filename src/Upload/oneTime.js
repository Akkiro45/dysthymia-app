import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";

import axios from '../../axios';
import { generateActivityData } from './util';

const oneTimeSend1 = () => {
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

const oneTimeSend = () => {
  AsyncStorage.getItem('pendingData')
    .then(pendingData => {
      if(pendingData) {
        pendingData = JSON.parse(pendingData);
        pendingData.forEach((data, i) => {
          if(Array.isArray(data.activities)) {
            pendingData[i].activities = generateActivityData(data.activities, data.activities[0].time);
          }
        });
      }
      const strPendingData = JSON.stringify(pendingData);
      AsyncStorage.setItem('pendingData', strPendingData);
    })
}

export default oneTimeSend;