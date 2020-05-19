import React from 'react';
import { AppRegistry, NativeModules, DeviceEventEmitter } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { Provider } from 'react-redux';

import store from './src/store/configStore';
import BroadcastService from './src/services/BroadcastService';
import NotificationListener, { NotificationRemoved } from './src/services/NotificationListener';
import { subscribeActivityRecognition } from './src/services/ActivityRecognition';
import MyHeadlessTask from './src/Upload/upload';
import { lightSensor, stepCounter } from './src/services/Sensors';
import test from './test';

// Sensors
const stepsIntervalInMiliSec = 600000;
const lightIntervalInMiliSec = 120000;

const mSensorManager = NativeModules.SensorManager;
mSensorManager.startStepCounter(stepsIntervalInMiliSec);
DeviceEventEmitter.addListener('StepCounter', stepCounter);
mSensorManager.startLightSensor(lightIntervalInMiliSec);
DeviceEventEmitter.addListener('LightSensor', lightSensor);

// mSensorManager.startStepCounterUsingAccel(1000);
// DeviceEventEmitter.addListener('StepCounterUsingAccel', (data) => {
//   console.log('Accel');
//   console.log(data);
// });

// test();

// Notification
RNAndroidNotificationListener.getPermissionStatus()
  .then(status => {
    if(status === 'denied') {
      RNAndroidNotificationListener.requestPermission();
    }
  });


RNAndroidNotificationListener.onNotificationReceived(NotificationListener);
RNAndroidNotificationListener.onNotificationRemoved(NotificationRemoved);
subscribeActivityRecognition();

AppRegistry.registerHeadlessTask('BroadcastService', () => BroadcastService);
AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);

const AppContainer = () => {
  return (
    <Provider store={store()} >
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => AppContainer);
