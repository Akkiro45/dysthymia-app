import prepareData from './prepareData';
import sendData from './sendData';
import oneTime from './oneTime';

const upload = async () => {
  console.log('Upload Service!');    

  // oneTime();

  // // Preparing Data
  prepareData();
  
  // // Sending Data
  setTimeout(() => {
    sendData();
  }, 5000);

}

export default upload;