import AsyncStorage from '@react-native-community/async-storage';

import prepareData from './prepareData';
import sendData from './sendData';
import getScore from './getScore';

const upload = async () => {
  console.log('Upload Service!');
  AsyncStorage.setItem('lastCalled', new Date().getTime().toString());
  try {
    // // Preparing Data
    prepareData();
    
    // // Sending Data
    // setTimeout(() => {
      sendData();
    // }, 5000);

    // setTimeout(() => {
      getScore();
    // }, 8000);

  } catch(e) {
    const obj = {
      time: new Date().getTime(),
      error: 'Service Error!'
    }
    AsyncStorage.setItem('uploadError', JSON.stringify(obj));
  }
}

export default upload;