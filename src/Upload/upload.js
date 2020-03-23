import prepareData from './prepareData';
import sendData from './sendData';
import oneTime from './oneTime';

const upload = async () => {
  console.log('Upload Service!');    

  // oneTime();
  try {
    
    // // Preparing Data
    prepareData();
    
    // // Sending Data
    setTimeout(() => {
      sendData();
    }, 5000);

  } catch(e) {
    console.log(e);
  }

}

export default upload;