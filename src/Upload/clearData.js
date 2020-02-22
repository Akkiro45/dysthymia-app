import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

const clearData = (startTime, endTime) => {
  // const startTime = parseInt(moment(1581967800000).startOf('day').format('x'));
  // const endTime = parseInt(moment(1581967800000).endOf('day').format('x'));
  const date = moment(startTime).format("DD/MM/YY");
  AsyncStorage.getItem('receiver')
    .then(receiver => {
      if(receiver) {
        receiver = JSON.parse(receiver);
        Object.keys(receiver).forEach(key => {
          if(key === 'activities' || key === 'lightSensor') {
            receiver[key] = receiver[key].filter(type => {
              if(type.time > endTime) {
                return true
              } else {
                return false;
              }
            });
          } else if(key === 'isUnlocked' || key === 'steps' || key === 'screenStartTime') {
            // Ignore
          } else {
            if(Array.isArray(receiver[key])) {
              receiver[key] = receiver[key].filter(type => {
                if(type.date === date) {
                  return false
                } else {
                  return true;
                }
              });
            }
          }
        });
        AsyncStorage.setItem('receiver', JSON.stringify(receiver));
      }
    })
    .catch(() => {
      console.log('Unable to read receiver data!');
    });
}

export default clearData;