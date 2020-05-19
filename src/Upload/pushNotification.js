import { NativeModules } from 'react-native';

const { PushNotification } = NativeModules;

const pushNotification = (title, text) => {
  PushNotification.pushNotification(title, text);
} 

export default pushNotification;