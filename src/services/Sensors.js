import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import { receiverStorageStructure } from '../util/receiverStorageStructure';

export const stepCounter = ({ steps }) => {
  // console.log('Normal');
  // console.log(steps);
  AsyncStorage.getItem('receiver')
    .then(receiver => {
      if(!receiver) {
        receiver = {
          ...receiverStorageStructure
        }
      } else {
        receiver = JSON.parse(receiver);
      }
      if(!receiver.stepCounter) {
        receiver.stepCounter = [];
      } 
      const currDate = moment().format("DD/MM/YY");
      let step;
      if(receiver.steps) {
        step = steps - receiver.steps;
        if(step < 0) {
          step = 0;
          // receiver.steps = steps;
        }
      } else {
        // receiver.steps = steps;
        step = 0;
      }

      const stepCounter = {
        date: currDate,
        steps: step
      }

      receiver.steps = steps;

      if(receiver.stepCounter.length === 0) {
        receiver.stepCounter.push(stepCounter);
      } else {
        let curr = receiver.stepCounter[receiver.stepCounter.length - 1];
        if(curr.date === currDate) {
          receiver.stepCounter[receiver.stepCounter.length - 1].steps = curr.steps + step;
        } else {
          receiver.stepCounter.push(stepCounter);
        }
      }
      AsyncStorage.setItem('receiver', JSON.stringify(receiver));
    })
    .catch(e => {
      console.log(e)
      console.log("Unable to read receiver from AsyncStorage.");
    });
}

export const lightSensor = ({ light }) => {
  // console.log(light);
  AsyncStorage.getItem('receiver')
    .then(receiver => {
      if(!receiver) {
        receiver = {
          ...receiverStorageStructure
        }
      } else {
        receiver = JSON.parse(receiver);
      }
      if(!receiver.lightSensor) {
        receiver.lightSensor = [];
      }
      const data = {
        time: new Date().getTime(),
        light
      }
      receiver.lightSensor.push(data);
      AsyncStorage.setItem('receiver', JSON.stringify(receiver));

    })
    .catch(e => {
      console.log(e)
      console.log("Unable to read receiver from AsyncStorage.");
    });
}