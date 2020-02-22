import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";

import axios from '../../axios';

const sendData = () => {
  NetInfo.fetch().then(state => {
    if(state.isInternetReachable) {
      let strData;
      AsyncStorage.getItem('pendingData') 
        .then(pendingData => {
          if(pendingData) {
            pendingData = JSON.parse(pendingData);
            if(pendingData.length > 0) {
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
                    axios.post('/stats/post', body, {headers})
                      .then(res => {
                        if(res.data.status === 'ok') {
                          pendingData.shift();
                          strData = JSON.stringify(pendingData);
                          AsyncStorage.setItem('pendingData', strData);
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

export default sendData;