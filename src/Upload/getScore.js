import AsyncStorage from '@react-native-community/async-storage';
// import NetInfo from "@react-native-community/netinfo";

import axios from '../../ml-axios';
import pushNotification from './pushNotification';

const getScore = () => {
  // NetInfo.fetch().then(state => {
  //   if(state.isInternetReachable) {
      let score = AsyncStorage.getItem('score');
      let auth = AsyncStorage.getItem('auth');
      Promise.all([score, auth])
        .then(res => {
          score = res[0];
          auth = JSON.parse(res[1]);
          let fetch = false;
          if(!score) {
            fetch = true;
            score = {
              score: null,
              startDay: null,
              endDay: null,
              time: null
            }
          } else {
            score = JSON.parse(score);
            if(score.time) {
              if(new Date().getTime() >= score.time) {
                fetch = true;
              }
            }
          }
          if(!auth) {
            fetch = false;
          }
          if(fetch) {
            const headers = {
              'x-auth': auth.token
            }
            axios.get(`/?fromUser=0`, { headers })
              .then(response => {
                if(response) {
                  if(response.data.status === 'ok') {
                    if(response.data.score) {
                      score.score = response.data.score;
                      score.time = response.data.time,
                      score.startDay = response.data.startDay;
                      score.endDay = response.data.endDay;
                      // Notify
                      // console.log('notify');
                      pushNotification('Your Depression Score is ' + score.score, 'click to see depression level');
                    } else {
                      score.time = response.data.initialTime;
                    }
                    AsyncStorage.setItem('score', JSON.stringify(score));
                  } 
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(e => {
          console.log(e);
        });
  //   }
  // });
}

export default getScore;