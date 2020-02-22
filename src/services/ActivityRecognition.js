import ActivityRecognition from 'react-native-activity-recognition';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import { receiverStorageStructure } from '../util/receiverStorageStructure';

let unsubscribe;

const storeActivity = (mostProbableActivity) => {
  AsyncStorage.getItem('receiver')
    .then(receiver => {
      if(!receiver) {
        receiver = {
          ...receiverStorageStructure
        }
      } else {
        receiver = JSON.parse(receiver);
      }
      if(!receiver.activities) {
        receiver.activities = [];
      }
      // const currDate = moment().format("DD/MM/YY");
      mostProbableActivity.time = new Date().getTime();
      receiver.activities.push(mostProbableActivity);
      AsyncStorage.setItem('receiver', JSON.stringify(receiver));
    })
    .catch(e => {
      console.log("Unable to read receiver from AsyncStorage.");
    });
}

export const subscribeActivityRecognition = () => {
  unsubscribe = ActivityRecognition.subscribe((detectedActivities) => {
    const mostProbableActivity = detectedActivities.sorted[0];
    storeActivity(mostProbableActivity);
    // console.log(detectedActivities);
    // console.log(mostProbableActivity);
  });
  startActivityRecognition();
}

export const unsubscribeActivityRecognition = () => {
  ActivityRecognition.stop();
  unsubscribe();
}

export const startActivityRecognition = () => {
  // const detectionIntervalMillis = 0.0007;
  const detectionIntervalMillis = 0.0279617; // 45mtr
  ActivityRecognition.start(detectionIntervalMillis);
}


